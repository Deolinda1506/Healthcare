import { useState, useEffect } from "react";
import createAxiosInstance from "../../features/axios";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useSelector } from "react-redux";
import { format, addDays } from "date-fns";
import toast from "react-hot-toast";

export default function DoctorSchedule({ selectedFutureDoctor }) {
  const [schedule, setSchedule] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [buttonLoading, setButtonLoading] = useState(false);
  const instance = createAxiosInstance();
  const patient = useSelector((state) => state.sharedData.profile.patient.user);

  useEffect(() => {
    const generateSchedule = () => {
      const startTime = 9;
      const endTime = 17;
      const slots = [];
      const currentDate = new Date();

      for (let day = 0; day < 5; day++) {
        const date = format(addDays(currentDate, day), "yyyy-MM-dd");
        for (let hour = startTime; hour < endTime; hour++) {
          slots.push(`${date}T${String(hour).padStart(2, "0")}:00:00Z`);
          slots.push(`${date}T${String(hour).padStart(2, "0")}:30:00Z`);
        }
      }

      setSchedule(slots);
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

    if (selectedFutureDoctor) {
      const fetchAppointments = async () => {
        try {
          const response = await instance.get(`appointments/get_appointments/${selectedFutureDoctor.user.id}`);
          setAppointments(response.data);
        } catch (error) {
          console.error("Error fetching appointments:", error);
          setError("Failed to fetch appointments. Please try again later.");
        } finally {
          setLoading(false);
        }
      };

      generateSchedule();
      fetchAppointments();
    }
  }, [selectedFutureDoctor]);

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
    setSelectedTime(""); // Reset time when date changes
  };

  const handleTimeChange = (event) => {
    setSelectedTime(event.target.value);
  };

  const handleAppointmentSchedule = async () => {
    if (!selectedDate || !selectedTime){
        toast.error("Please select a date and time.");
        return;
    };

    setButtonLoading(true);

    const slot = `${selectedDate}T${selectedTime}:00Z`;

    try {
      await instance.post("appointments/create_appointment", {
        doctorId: selectedFutureDoctor.user.id,
        patientId: patient.id,
        start: slot
      });
      toast.success(`Appointment scheduled with ${selectedFutureDoctor.user.name} at ${slot}.`);
      setSelectedDate("");
      setSelectedTime("");
    } catch (error) {
      console.error("Error scheduling appointment:", error);
      setError("Failed to schedule appointment. Please try again later.");
    } finally {
      setButtonLoading(false);
    }
  };

  const filteredTimes = schedule.filter((slot) => {
    const slotDate = slot.split("T")[0];
    const slotTime = slot.split("T")[1].split(":00Z")[0];
    const isBooked = appointments.some((appt) => appt.start === slot);
    return slotDate === selectedDate && !isBooked;
  }).map((slot) => slot.split("T")[1].split(":00Z")[0]);

  return (
    <div className="container flex flex-col gap-4 mx-auto p-6 bg-white rounded-lg shadow-lg max-w-3xl">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
        {selectedFutureDoctor ? `${selectedFutureDoctor.user.name}'s Schedule` : "Doctor's Schedule"}
      </h1>
      {loading ? (
        <div className="text-center">
          <AiOutlineLoading3Quarters className="animate-spin text-blue-600 text-3xl mx-auto" />
          <p>Loading schedule...</p>
        </div>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : (
        <>
          <div className="mb-6">
            <label className="block mb-2 text-lg font-semibold text-gray-700" htmlFor="date">
              Select Date:
            </label>
            <select
              id="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Select Date --</option>
              {[...new Set(schedule.map((slot) => slot.split("T")[0]))].map((date, index) => (
                <option key={index} value={date}>
                  {date}
                </option>
              ))}
            </select>
          </div>

          {selectedDate && (
            <div className="mb-6">
              <label className="block mb-2 text-lg font-semibold text-gray-700" htmlFor="time">
                Select Time:
              </label>
              <select
                id="time"
                value={selectedTime}
                onChange={handleTimeChange}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Select Time --</option>
                {filteredTimes.length > 0 ? (
                  filteredTimes.map((time, index) => (
                    <option key={index} value={time}>
                      {time}
                    </option>
                  ))
                ) : (
                  <option value="">No available times</option>
                )}
              </select>
            </div>
          )}

          {selectedDate && selectedTime && (
            <div className="selected-slot mt-6 text-center">
              <p className="text-lg mb-4 font-semibold text-gray-700">
                Selected Slot: {`${selectedDate} ${selectedTime}`}
              </p>
              <button
                className={`w-full py-3 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition-all ${
                  buttonLoading ? "cursor-not-allowed opacity-50" : ""
                }`}
                onClick={handleAppointmentSchedule}
                disabled={buttonLoading}
              >
                {buttonLoading ? (
                  <>
                    <AiOutlineLoading3Quarters className="animate-spin mr-2" />
                    Scheduling...
                  </>
                ) : (
                  "Schedule Appointment"
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
