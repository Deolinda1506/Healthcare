import { useDispatch, useSelector } from "react-redux";
import { addCallId, changepage } from "../../features/SharedData";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useState } from "react";
import createAxiosInstance from "../../features/axios";
import { createCall, answerCall } from "../../features/call";
import { firestore } from "../../../main";

export default function JoinCall({ doctor, patient }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const instance = createAxiosInstance();

  const joinCall = async () => {
    setLoading(true);
    console.log(doctor, patient);
    instance
      .post("appointments/join_call", {
        patient: patient.id || patient,
        doctor: doctor.user.id ? doctor.user.id : doctor.id ? doctor.id : doctor,
        specialization: doctor.specialization || "General",
      })
      .then(async (response) => {
        if (response.data.call_id) {
          dispatch(addCallId({ id: response.data.call_id, type: "answer" }));
          dispatch(changepage("call"));
          setLoading(false);
          return;
        } else {
          const notificationData = {
            type: "call",
            patient: patient.id || patient,
            doctor: doctor,
            read: false,
            userId: doctor.user.id ? doctor.user.id : doctor.id ? doctor.id : doctor,
            message: `Consultation between ${doctor.user.name ? doctor.user.name : doctor.name ? doctor.name : "Doctor"} and ${patient.name} has been requested.`,
            created: new Date().toISOString(),
          };

          try {
            await firestore.collection("notifications").add(notificationData);
            console.log("Notification saved successfully");
          } catch (error) {
            console.error("Error saving notification:", error);
          }

          dispatch(
            addCallId({
              id: response.data.call_id,
              type: "create",
              appointment_id: response.data.appointment_id,
            })
          );
          dispatch(changepage("call"));
          setLoading(false);
        }
      });
  };

  return (
    <button
      className="w-full py-3 px-4 mb-4 text-[green] border border-[green] rounded-md hover:bg-green-700 hover:text-white transition-all flex justify-center items-center"
      onClick={joinCall}
    >
      {loading ? (
        <AiOutlineLoading3Quarters className="animate-spin mr-2" />
      ) : (
        "Join Call"
      )}
    </button>
  );
}
