import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
  FaPhoneSlash,
  FaComments,
  FaTimes,
} from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import { firestore, pc } from "../../../main";
import { answerCall } from "../../features/call";
import { useSelector, useDispatch } from "react-redux";
import { resetCallId, addCallId } from "../../features/SharedData";
import createAxiosInstance from "../../features/axios";

export default function VideoCall() {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [call_id, setCall_id] = useState(
    useSelector((state) => state.sharedData.callId)
  );
  const userId = useSelector(
    (state) => state.sharedData.profile.patient.user.id
  );
  const profile = useSelector((state) => state.sharedData.profile.patient);
  const dispatch = useDispatch();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const pcRef = useRef(null);
  const instance = createAxiosInstance();


  const createCall = async (data) => {
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
          if (
            candidateData &&
            candidateData.sdpMid !== null &&
            candidateData.sdpMLineIndex !== null &&
            Object.keys(candidateData).length > 0
          ) {
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
    const offerCandidates = callDoc.collection("offerCandidates");

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
          if (
            candidateData &&
            candidateData.sdpMid !== null &&
            candidateData.sdpMLineIndex !== null &&
            Object.keys(candidateData).length > 0
          ) {
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

  useEffect(() => {
    const getStreams = async () => {
      try {
        let localStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        let remoteStream = new MediaStream();
        localStreamRef.current = localStream;

        pcRef.current = pc;
        localStream.getTracks().forEach((track) => {
          pcRef.current.addTrack(track, localStream);
        });

        pcRef.current.ontrack = (event) => {
          event.streams[0].getTracks().forEach((track) => {
            remoteStream.addTrack(track);
          });
        };
        if (call_id.type) {
          if (call_id.type === "answer") {
            console.log("Answering call with ID:", call_id.id);
            await answerCall(call_id.id);
          }

          if (call_id.type === "create") {
            const callId = await createCall({});
            console.log("Created call with ID:", callId);
            instance.patch("appointments/update_appointment", {
              id: call_id.appointment_id,
              call_id: callId,
            });
            dispatch(addCallId({...call_id, id:callId}))
          }
        }

        setInterval(() => {
          console.log(pcRef.current);
        }, 10000);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = localStream;
        }

        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
        }
        if (profile.user.user_role === "Health Professional") {
          instance.post('change_availability')
        }
      } catch (error) {
        console.error("Error accessing media devices:", error);
      }
    };

    getStreams();

    return () => {
      if (pcRef.current) {
        pcRef.current.close();
      }
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => {
          track.stop();
        });
      }
      instance.patch("appointments/update_appointment", {
        id: call_id.appointment_id,
        call_id: "",
        completed: true
      });
      if (profile.user.user_role === "Health Professional") {
        instance.post('change_availability')
      }
      dispatch(resetCallId())
    };
  }, []);

  useEffect(() => {
    if (call_id.id) {
      const unsubscribe = firestore
        .collection("calls")
        .doc(call_id.id)
        .collection("messages")
        .orderBy("timestamp")
        .onSnapshot((snapshot) => {
          const fetchedMessages = snapshot.docs.map((doc) => doc.data());
          setMessages(fetchedMessages);
        });

      return () => unsubscribe();
    }
  }, [call_id.id]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (localStreamRef.current) {
      localStreamRef.current
        .getAudioTracks()
        .forEach((track) => (track.enabled = !track.enabled));
    }
  };

  const toggleVideo = () => {
    setIsVideoOff(!isVideoOff);
    if (localStreamRef.current) {
      localStreamRef.current
        .getVideoTracks()
        .forEach((track) => (track.enabled = !track.enabled));
    }
  };

  const handleHangup = () => {
    toast.success("Hanging up the call...");
    if (pcRef.current) {
      pcRef.current.close();
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    instance.patch("appointments/update_appointment", {
      id: call_id.appointment_id,
      call_id: "",
      completed: true
    });
    dispatch(resetCallId());
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() !== "") {
      await firestore
        .collection("calls")
        .doc(call_id.id)
        .collection("messages")
        .add({
          text: newMessage,
          timestamp: new Date(),
          senderId: userId,
        });
      setNewMessage("");
    }
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className="relative w-full h-full bg-gray-900 flex">
      <div
        className={`relative ${
          isChatOpen ? "w-full md:w-3/4" : "w-full"
        } h-full bg-gray-900 transition-all`}
      >
        <div className="absolute right-4 top-4 w-1/3 h-1/4 md:w-1/4 md:h-1/3 bg-black rounded-md overflow-hidden shadow-lg">
          <video
            id="user-1"
            ref={localVideoRef}
            className="w-full h-full flex items-center justify-center text-white text-lg md:text-2xl"
            autoPlay
            playsInline
          />
        </div>

        <div className="w-full h-full bg-black flex items-center justify-center text-white text-2xl md:text-4xl">
          <video
            id="user-2"
            className="w-full"
            ref={remoteVideoRef}
            autoPlay
            playsInline
          />
        </div>

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-3/4 md:w-1/2 bg-[#DDE4F0] p-2 md:p-3 rounded-md flex justify-around items-center shadow-lg">
          <div className="mute cursor-pointer" onClick={toggleMute}>
            {isMuted ? (
              <FaMicrophoneSlash className="text-red-600 text-2xl" />
            ) : (
              <FaMicrophone className="text-green-600 text-2xl" />
            )}
          </div>
          <div className="video-toggle cursor-pointer" onClick={toggleVideo}>
            {isVideoOff ? (
              <FaVideoSlash className="text-red-600 text-2xl" />
            ) : (
              <FaVideo className="text-green-600 text-2xl" />
            )}
          </div>
          <div className="hangup cursor-pointer" onClick={handleHangup}>
            <FaPhoneSlash className="text-red-600 text-2xl" />
          </div>
          <div className="chat-toggle cursor-pointer" onClick={toggleChat}>
            {isChatOpen ? (
              <FaTimes className="text-gray-600 text-2xl" />
            ) : (
              <FaComments className="text-gray-600 text-2xl" />
            )}
          </div>
        </div>
      </div>

      {isChatOpen && (
        <div className="w-full md:w-1/4 h-full bg-white flex flex-col shadow-lg transition-all overflow-hidden">
          <div className="flex-grow p-2 md:p-4 overflow-y-auto text-wrap">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-1 md:p-2 rounded-lg my-1 md:my-2 ${
                  msg.senderId === userId ? "bg-blue-200" : "bg-green-200"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div className="p-2 md:p-4 border-t border-gray-300 flex">
            <input
              type="text"
              className="flex-grow p-1 md:p-2 border border-gray-300 rounded-lg mr-2"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type your message..."
            />
            <button
              className="bg-blue-500 text-white p-1 md:p-2 rounded-lg"
              onClick={handleSendMessage}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
