import { useState, useEffect, useRef } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import MenuIcon from "@mui/icons-material/Menu";
import { useSelector, useDispatch } from "react-redux";
import { resetStateToDefault, changepage, changeAvailability } from "../../features/SharedData";
import { useNavigate } from "react-router-dom";
import { Badge } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { firestore } from "../../../main";
import createAxiosInstance from "../../features/axios";

export default function TopBar({
  isOpen,
  toggleSidebar,
  notificationOpen,
  setNotificationOpen,
}) {
  const [open, setOpen] = useState(false);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const dropdownRef = useRef(null);
  const user = useSelector((state) => state.sharedData.profile.patient.user);
  const profile = useSelector((state) => state.sharedData.profile);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [secOpen, setSecOpen] = useState(false);
  const [available, setAvailable] = useState(profile.patient.available);
  const secondDropRef = useRef(null);
  const instance = createAxiosInstance();
  console.log(profile)

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setOpen(false);
    }
    if (secondDropRef.current && !secondDropRef.current.contains(event.target)) {
      setSecOpen(false);
    }
  };

  const handleAvailable = () => {
    instance.post("change_availability")
      .then((res) => {
        setAvailable((prev) => !prev);
        setSecOpen(false); 
      })
  };

  useEffect(() => {
    dispatch(changeAvailability(available));
  }, [available]);

  const handleLogout = async () => {
    dispatch(resetStateToDefault());
    navigate("/login");
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = firestore.collection("notifications")
      .where("userId", "==", user?.id)
      .where("read", "==", false)
      .onSnapshot((snapshot) => {
        setNotificationsCount(snapshot.size);
      });

    return () => unsubscribe();
  }, [user?.id]);

  return (
    <div className="flex items-center w-full justify-between shadow-md bg-white sticky top-0 z-10 sm:px-4">
      <div className="flex items-center gap-2">
        {!isOpen && (
          <MenuIcon
            sx={{ fontSize: 30, cursor: "pointer" }}
            onClick={toggleSidebar}
            className={`${isOpen ? "hidden" : "block"}`}
          />
        )}
        {!isOpen && (
          <span className="hidden sm:block sm:text-xl text-[#12B536] sm:ml-1">
            <span className="text-[#2F4AD6]">Health</span>Connect
          </span>
        )}
      </div>
      <div className="flex items-center">
        {user.user_role === "Health Professional" &&
        <div
          className="relative p-3 rounded-md"
          ref={secondDropRef}
        >
          <div
            className={`flex items-center  cursor-pointer ${
              available ? "text-green-500 hover:text-green-800" : "text-red-500 hover:text-red-800"
            }`}
            onClick={() => setSecOpen(!secOpen)}
          >
            {available ? "Available" : "Unavailable"}
            <ArrowDropDownIcon />
          </div>
          {secOpen && (
            <div className="absolute right-0 mt-2 w-full border-t border-gray-200 bg-white shadow-lg rounded-md">
              <div className={`px-4 py-2 cursor-pointer hover:bg-gray-100 hover:rounded-md ${
              !available ? "text-green-500 hover:text-green-800" : "text-red-500 hover:text-red-800"
            }`} onClick={() => handleAvailable()}>
                {!available ? "Available" : "Unavailable"}
              </div>
            </div>
          )}
        </div>
}
        <div
          className="relative hover:bg-gray-200 p-3 rounded-md"
          ref={dropdownRef}
        >
          <div
            className="flex items-center cursor-pointer"
            onClick={() => setOpen(!open)}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
              alt="Avatar"
              className="w-10 rounded-full"
            />
            {user && (
              <span className="ml-2 hidden sm:block">
                {user.name}
              </span>
            )}
            <ArrowDropDownIcon />
          </div>
          {open && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md">
              <div className="px-4 py-2 cursor-pointer hover:bg-gray-100 hover:rounded-md" onClick={() => dispatch(changepage("account"))}>
                Profile
              </div>
              <div className="px-4 py-2 cursor-pointer hover:bg-gray-100" onClick={() => dispatch(changepage("account"))}>
                Settings
              </div>
              <div
                onClick={handleLogout}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100 hover:rounded-md"
              >
                Logout
              </div>
            </div>
          )}
        </div>
        <div
          className="badge mr-8 sm:mr-2 hover:text-[#2F4AD6] transition"
          onClick={() => setNotificationOpen(!notificationOpen)}
        >
          <Badge color="primary" badgeContent={notificationsCount}>
            <NotificationsIcon sx={{ cursor: "pointer", fontSize: 30 }} />
          </Badge>
        </div>
      </div>
    </div>
  );
}
