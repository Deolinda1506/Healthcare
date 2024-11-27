import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import AppointmentRow from "./AppointmentRow";
import { useSelector, useDispatch } from "react-redux";
import { changepage } from "../../features/SharedData";
import createAxiosInstance from "../../features/axios";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function Appointments() {
  const [showUpcoming, setShowUpcoming] = useState(true);
  const page = useSelector((state) => state.sharedData.page);
  const [soonAppointments, setSoonAppointments] = useState([]);
  const [otherUpcomingAppointments, setOtherUpcomingAppointments] = useState(
    []
  );
  const [pastAppointments, setPastAppointments] = useState([]);
  const profile = useSelector((state) => state.sharedData.profile.patient);
  const instance = createAxiosInstance();
  const [loading, setLoading] = useState(false);

  const handleCancel = (id) => {
    setSoonAppointments((prev) =>
      prev.filter((appointment) => appointment.id !== id)
    );
    setOtherUpcomingAppointments((prev) =>
      prev.filter((appointment) => appointment.id !== id)
    );
  };

  const getUpcomingAppointments = () => {
    setLoading(true);
    instance
      .get("appointments/get_upcoming_appointments")
      .then((response) => {
        setSoonAppointments(response.data.soon_appointments);
        setOtherUpcomingAppointments(response.data.other_upcoming_appointments);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch upcoming appointments:", error);
      });
  };

  const getPastAppointments = () => {
    setLoading(true);
    instance
      .get("appointments/get_past_appointments")
      .then((response) => {
        setPastAppointments(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch past appointments:", error);
      });
  };

  useEffect(() => {
    if (showUpcoming) {
      getUpcomingAppointments();
    } else {
      getPastAppointments();
    }
  }, [showUpcoming]);

  const dispatch = useDispatch();

  const toggleAppointments = () => {
    setShowUpcoming(!showUpcoming);
  };

  const appointments = showUpcoming
    ? [...soonAppointments, ...otherUpcomingAppointments]
    : pastAppointments;

  return (
    <div className="mt-2 mx-4 flex flex-col bg-white h-full p-4 py-2 rounded-lg">
      {profile.user.user_role !== "Health Professional" && (
        <div
          className="new-consultation mr-4 mb-1 ml-auto flex items-center text-white font-medium px-4 py-2 bg-green-600 hover:bg-green-700 transition-all rounded-lg cursor-pointer"
          onClick={() => dispatch(changepage("new consultation"))}
        >
          <AddIcon sx={{ fontSize: 28 }} />
          <span className="text-md font-light">New Consultation</span>
        </div>
      )}
      <div className="appointments-toggle mb-2 flex justify-center">
        <button
          className={`px-4 w-1/2 sm:w-1/4 py-2 rounded-l-lg ${
            showUpcoming ? "bg-[#2F4AD6] text-white" : "bg-gray-200 text-black"
          }`}
          onClick={() => setShowUpcoming(true)}
        >
          Upcoming
        </button>
        <button
          className={`px-4 w-1/2 sm:w-1/4 py-2 rounded-r-lg ${
            !showUpcoming ? "bg-[#2F4AD6] text-white" : "bg-gray-200 text-black"
          }`}
          onClick={() => setShowUpcoming(false)}
        >
          Past
        </button>
      </div>
      <div className="appointments-list w-full text-center sm:text-left">
        <span className="text-lg font-medium ml-4 sm:ml-14">
          {showUpcoming ? "Upcoming Appointments" : "Past Appointments"}
        </span>
        <div className="text-lg sm:text-sm">
          {appointments.length === 0 ? ( loading ? <AiOutlineLoading3Quarters className="animate-spin mx-auto mt-4" /> :
            (<div className="mt-4 text-center text-gray-500">
              No {showUpcoming ? "upcoming" : "past"} appointments.
            </div>)
          ) : (
            appointments.map((appointment, index) => (
              <AppointmentRow
                key={index}
                appointment={appointment}
                index={index}
                showUpcoming={showUpcoming}
                highlight={soonAppointments.includes(appointment)}
                onCancel={handleCancel}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
