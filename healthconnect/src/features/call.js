import { firestore, pc } from "../../main";
import createAxiosInstance from "./axios";

const createCall = async (data) => {
    const instance = createAxiosInstance();
    const callDoc = firestore.collection("calls").doc();
    const offerCandidates = callDoc.collection("offerCandidates");
    const answerCandidates = callDoc.collection("answerCandidates");

    console.log("Creating call with ID:", callDoc.id);


    pc.onicecandidate = (event) => {
        if (event.candidate) {
            console.log("New ICE candidate:", event.candidate);
            offerCandidates.add(event.candidate.toJSON());
        } else {
            console.log("End of ICE candidates.");
        }
    };

    const offerDescription = await pc.createOffer();
    await pc.setLocalDescription(offerDescription);

    const offer = {
        sdp: offerDescription.sdp,
        type: offerDescription.type,
    };

    await callDoc.set({ offer });

    callDoc.onSnapshot((snapshot) => {
        const data = snapshot.data();
        if (!pc.currentRemoteDescription && data?.answer) {
            console.log("Setting remote description with answer:", data.answer);
            pc.setRemoteDescription(new RTCSessionDescription(data.answer));
        }
    });

    answerCandidates.onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
                console.log("Got new remote ICE candidate: ", change.doc.data());
                let candidateData = change.doc.data();
                if (candidateData && candidateData.sdpMid !== null && candidateData.sdpMLineIndex !== null && Object.keys(candidateData).length > 0) {
                    console.log(candidateData);
                    let candidate = new RTCIceCandidate(candidateData);
                    console.log("Adding answer candidate:", candidate);
                    pc.addIceCandidate(candidate).catch((e) => {
                        console.error("Error adding ICE candidate: ", e);
                    });
                } else {
                    console.error("Invalid ICE candidate data:", candidateData);
                }
            }
        });
    });

    return callDoc.id;
};

const answerCall = async (callId) => {
    console.log("Answering call with ID:", callId);
    const callDoc = firestore.collection("calls").doc(callId);
    const answerCandidates = callDoc.collection("answerCandidates");
    const offerCandidates = callDoc.collection('offerCandidates');

    pc.onicecandidate = (event) => {
        if (event.candidate) {
            console.log("Adding answer candidate:", event.candidate);
            answerCandidates.add(event.candidate.toJSON());
        } else {
            console.log("End of answer candidates.");
        }
    };

    const callData = (await callDoc.get()).data();
    const offerDescription = callData.offer;
    await pc.setRemoteDescription(new RTCSessionDescription(offerDescription));

    const answerDescription = await pc.createAnswer();
    await pc.setLocalDescription(answerDescription);

    const answer = {
        type: answerDescription.type,
        sdp: answerDescription.sdp,
    };

    await callDoc.update({ answer });

    offerCandidates.onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
                let candidateData = change.doc.data();
                if (candidateData && candidateData.sdpMid !== null && candidateData.sdpMLineIndex !== null && Object.keys(candidateData).length > 0) {
                    let candidate = new RTCIceCandidate(candidateData);
                    console.log("Adding offer candidate:", candidate);
                    pc.addIceCandidate(candidate).catch((e) => {
                        console.error("Error adding ICE candidate: ", e);
                    });
                } else {
                    console.error("Invalid ICE candidate data:", candidateData);
                }
            }
        });
    });

    return callDoc.id;
};

export { createCall, answerCall };
