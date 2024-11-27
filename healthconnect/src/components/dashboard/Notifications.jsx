import React, { useState, useEffect } from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import { useDispatch, useSelector } from "react-redux";
import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { firestore } from "../../../main";
import JoinCall from "../appointments/JoinCall";
import createAxiosInstance from "../../features/axios";

export const Notifications = ({ notificationOpen, setNotificationOpen }) => {
  const [notifications, setNotifications] = useState([]);
  const [readNotifications, setReadNotifications] = useState([]);
  const [read, setRead] = useState(false);
  const user = useSelector((state) => state.sharedData.profile.patient.user);
  const instance = createAxiosInstance();
  const dispatch = useDispatch();

  useEffect(() => {
    let unsubscribe;
    if (notificationOpen) {
      const q = query(
        collection(firestore, "notifications"),
        where("userId", "==", user.id),
        where("read", "==", false)
      );
      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const notifs = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          notifs.sort((a, b) => {
            const dateA = new Date(a.created);
            const dateB = new Date(b.created);
            return dateB - dateA;
          });
          setNotifications(notifs);
          const readNotifs = notifs
            .filter((notif) => notif.read)
            .map((notif) => notif.id);
          setReadNotifications(readNotifs);
          console.log(notifications, user);
        },
        (error) => {
          console.error("Error fetching notifications:", error);
        }
      );
    }
    return () => unsubscribe && unsubscribe();
  }, [notificationOpen]);

  useEffect(() => {
    if (!notificationOpen) {
      setRead(true);
      if (read) {
        notifications.forEach(async (notif) => {
          const notificationRef = doc(firestore, "notifications", notif.id);
          await updateDoc(notificationRef, { read: true });
        });
      }
    }
  }, [notificationOpen, readNotifications]);

  const handleMarkAsRead = (id) => {
    if (!readNotifications.includes(id)) {
      setReadNotifications([...readNotifications, id]);
    }
  };

  const handleGrantRefill = (notification) => {
    instance.post("/appointments/grant_refill", {
      prescription_id: notification.prescription_id,
    });
  };

  const handleDeleteNotification = async (id) => {
    try {
      await deleteDoc(doc(firestore, "notifications", id));
      setNotifications(notifications.filter((notif) => notif.id !== id));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) {
      return "--:--";
    }
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    return isToday
      ? date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      : date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
  };

  return (
    <div className="m-4">
      <div className="title text-xl font-extrabold text-blue-600 py-4 border-b-2 border-blue-600 flex items-center">
        <button
          className="text-blue-600 rounded-md focus:outline-none mr-2"
          onClick={() => setNotificationOpen(!notificationOpen)}
          aria-label="Close notifications"
        >
          <CancelIcon style={{ fontSize: "30px" }} />
        </button>
        Notifications
      </div>
      <div className="notis">
        {notifications.length === 0 ? (
          <p className="p-2 py-4 text-gray-500">No new notifications</p>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`notification flex flex-col gap-1 justify-between border-b-2 p-2 py-4 m-0 border-[#207855] items-center ${
                readNotifications.includes(notification.id) ? "bg-gray-200" : ""
              }`}
              onClick={() => handleMarkAsRead(notification.id)}
            >
              <div className="flex flex-col gap-1">
                <p>{notification.message}</p>
                <p className="text-xs text-gray-400">
                  {formatTimestamp(notification.created)}
                </p>
              </div>
              {notification.type === "refill" && (
                <div className="flex gap-2 text-sm">
                  <button
                    className="py-1 px-4 mb-4 text-[green] border border-[green] rounded-md hover:bg-green-700 hover:text-white transition-all flex justify-center items-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGrantRefill(notification);
                    }}
                  >
                    Grant Refill
                  </button>
                  <button
                    className="py-1 px-4 mb-4 text-[red] border border-[red] rounded-md hover:bg-red-700 hover:text-white transition-all flex justify-center items-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteNotification(notification.id);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              )}
              {(notification.type === "match" ||
                notification.type === "call") && (
                <div className="flex gap-2 text-sm">
                  <JoinCall
                    patient={notification.patient}
                    doctor={notification.doctor}
                  />
                  <button
                    className="py-1 px-4 mb-4 text-[red] border border-[red] rounded-md hover:bg-red-700 hover:text-white transition-all flex justify-center items-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteNotification(notification.id);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
