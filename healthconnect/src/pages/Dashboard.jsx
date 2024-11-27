import { useState, useEffect } from "react";
import PatientDash from "../components/dashboard/PatientDash";
import DoctorDash from "../components/dashboard/DoctorDash";
import SideBar from "../components/sharedComponents/SideBar";
import TopBar from "../components/sharedComponents/TopBar";
import { useSelector } from "react-redux";
import Appointments from "../components/appointments/Appointments";
import NewConsultation from "../components/appointments/NewConsultation";
import HealthInformation from "../components/healthInformation/HealthInformation";
import createAxiosInstance from "../features/axios";
import VideoCall from "../components/appointments/VideoCall";
import { Notifications } from "../components/dashboard/Notifications";
import Account from "../components/dashboard/Account";
import DoctorSchedule from "../components/appointments/DoctorSchedule";
import PrescriptionList from "../components/dashboard/PrescriptionList";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const page = useSelector((state) => state.sharedData.page);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [selectedFutureDoctor, setSelectedFutureDoctor] = useState(null);
  const instance = createAxiosInstance();
  const goto = useNavigate();
  const profile = useSelector((state) => state.sharedData.profile.patient);
  useEffect(() => {
    if (Object.keys(profile.user).length === 0) {
      window.location.href = "/login";
    }
  })
  const isScreenWidth767 = () => {
    return window.innerWidth;
  };

  useEffect(() => {
    if (isScreenWidth767() >= 867) {
      setIsOpen(true); // Open sidebar if screen width is greater than or equal to 767 pixels
    } else {
      setIsOpen(false); // Close sidebar if screen width is less than 767 pixels
    }
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  
  return (
    <div className={`flex ${false && bg-gray-100}`}>
      <SideBar isOpen={isOpen} toggleSidebar={toggleSidebar}/>
      <div className="flex flex-col w-full">
        <TopBar isOpen={isOpen} toggleSidebar={toggleSidebar} notificationOpen={notificationOpen} setNotificationOpen={setNotificationOpen}/>
        {page === "dashboard" && profile.user.user_role === "Patient" && <PatientDash />}
        {page === "dashboard" && profile.user.user_role === "Health Professional" && <DoctorDash />}
        {page === "appointments" && <Appointments />}
        {page === "new consultation" && <NewConsultation setSelectedFutureDoctor={setSelectedFutureDoctor} selectedFutureDoctor={selectedFutureDoctor} />}
        {page === "health information" && <HealthInformation />}
        {page === "call" && <VideoCall />}
        {page === "account" && <Account />}
        {page === "doctor schedule" && <DoctorSchedule selectedFutureDoctor={selectedFutureDoctor} />}
        {page === "prescriptions" && <PrescriptionList />}
      </div>
        <div
        className={`shadow-sm  bg-white text-primary flex-shrink-0 overflow-y-auto  transition-all duration-200 ease-in-out ${notificationOpen ? 'translate-x-0 w-1/5' : '-translate-x-64 w-0'
          }`}
      >
        {/** Sidebar Or Body Goes  */}
        <Notifications notificationOpen={notificationOpen} setNotificationOpen={setNotificationOpen} />
        </div>
    </div>
  );
}
