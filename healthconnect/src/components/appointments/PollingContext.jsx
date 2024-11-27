import { createContext, useState, useEffect, useCallback, useContext, useRef } from "react";
import createAxiosInstance from "../../features/axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { firestore } from "../../../main";

const PollingContext = createContext();

export function PollingProvider({ children }) {
  const [polling, setPolling] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [matchedDoctor, setMatchedDoctor] = useState(null);
  const [doctorInfo, setDoctorInfo] = useState(null);
  const [notified, setNotified] = useState(false);
  const instance = createAxiosInstance();
  const userId = useSelector(state => state.sharedData.profile.patient.user.id);

  const saveNotification = async (userName, doctor) => {
    const notificationData = {
      type: "match",
      userId: userId,
      read: false,
      doctor: doctor,
      patient: userId,
      message: `Matched with ${userName}`,
      created: new Date().toISOString(),
    };

    try {
      await firestore.collection("notifications").add(notificationData);
      console.log("Notification saved successfully");
    } catch (error) {
      console.error("Error saving notification:", error);
    }
  };


  const fetchRandomMatch = useCallback(() => {
    if (!selectedSpecialty) return;

    instance
      .post("appointments/get_random_match", { specialty: selectedSpecialty })
      .then((response) => {
        setMatchedDoctor({
          name: response.data.user.name,
          specialty: response.data.specialization || "General Practitioner",
          imageUrl: response.data.user.profile_pic || "https://cdn-icons-png.flaticon.com/512/149/149071.png",
        });
        setDoctorInfo(response.data);
        toast.success("Doctor found!");
        saveNotification(response.data.user.name, response.data);
        setPolling(false);
      })
      .catch((error) => {
        if (error.response?.data?.message === "No available doctors") {
          setNotified(prev => {
            if (!prev) {
              toast.error("No available doctors. We will notify you when one becomes available.");
              return true;
            }
            return prev;
          });
        } else {
          toast.error("Error fetching doctor");
        }
      });
  }, [selectedSpecialty, instance]);

  useEffect(() => {
    let intervalId;
    if (polling) {
        fetchRandomMatch();
      intervalId = setInterval(fetchRandomMatch, 30000);
    }
    return () => clearInterval(intervalId);
  }, [polling, fetchRandomMatch]);

  return (
    <PollingContext.Provider value={{ polling, setPolling, selectedSpecialty, setSelectedSpecialty, matchedDoctor, setMatchedDoctor, doctorInfo  }}>
      {children}
    </PollingContext.Provider>
  );
}

export function usePolling() {
  return useContext(PollingContext);
}
