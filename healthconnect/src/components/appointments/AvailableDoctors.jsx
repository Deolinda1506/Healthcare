import { useState, useEffect, useRef } from "react";
import createAxiosInstance from "../../features/axios";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import JoinCall from "./JoinCall";
import { useSelector, useDispatch } from "react-redux";
import { changepage } from "../../features/SharedData";

export default function AvailableDoctors({selectedFutureDoctor, setSelectedFutureDoctor}) {
  const [immediateSearchTerm, setImmediateSearchTerm] = useState("");
  const [futureSearchTerm, setFutureSearchTerm] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctorsData, setDoctorsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allDoctors, setAllDoctors] = useState([]);
  const instance = createAxiosInstance();
  const selectedDoctorRef = useRef(null);
  const selectedDoctorFutureRef = useRef(null);
  const patient = useSelector((state) => state.sharedData.profile.patient.user)
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await instance.get(
          "appointments/get_available_doctors"
        );
        setDoctorsData(response.data);
        const otherResponse = await instance.get(
          "appointments/get_all_doctors"
        );
        setAllDoctors(otherResponse.data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        setError("Failed to fetch doctors. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const handleImmediateSearchChange = (event) => {
    setImmediateSearchTerm(event.target.value);
  };

  const handleFutureSearchChange = (event) => {
    setFutureSearchTerm(event.target.value);
  };

  const handleDoctorSelect = (doctor, isFuture) => {
    if (isFuture) {
      setSelectedFutureDoctor(doctor);
    } else {
      setSelectedDoctor(doctor);
    }
  };


  const filteredImmediateDoctors = doctorsData.filter(
    (doctor) =>
      doctor.user.name.toLowerCase().includes(immediateSearchTerm.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(immediateSearchTerm.toLowerCase())
  );

  const filteredFutureDoctors = allDoctors.filter(
    (doctor) =>
      doctor.user.name.toLowerCase().includes(futureSearchTerm.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(futureSearchTerm.toLowerCase())
  );

  useEffect(() => {
    const ref = selectedDoctorRef.current != null ? selectedDoctorRef : selectedDoctorFutureRef;
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedDoctor, selectedFutureDoctor]);


  return (
    <div className="sm:flex text-[14px]">
      <div className="schedule-appointment sm:w-1/2 p-6 bg-white rounded-md shadow-md">
        <h1 className="text-lg text-center font-bold mb-6">
          Request Immediate Consultation
        </h1>
        <input
          type="text"
          placeholder="Search doctors by name or specialty"
          value={immediateSearchTerm}
          onChange={handleImmediateSearchChange}
          className="w-full p-3 mb-6 border rounded-md"
        />
        {loading ? (
          <div className="text-center">
            <AiOutlineLoading3Quarters className="animate-spin text-blue-600" />
            <p>Loading doctors...</p>
          </div>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : (
          <div className="doctors-list max-h-60 overflow-y-auto">
            {filteredImmediateDoctors.length > 0 ? (
              filteredImmediateDoctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className={`doctor-item flex items-center p-3 mb-3 border-b cursor-pointer hover:bg-blue-100 ${
                    selectedDoctor === doctor ? "bg-blue-200" : ""
                  }`}
                  onClick={() => handleDoctorSelect(doctor, false)}
                >
                  <img
                    src={
                      doctor.user.profile_pic ||
                      "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                    }
                    alt={doctor.user.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <p className="font-semibold">{doctor.user.name}</p>
                    <p className="text-gray-600">{doctor.specialization}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-600">No doctors found</p>
            )}
          </div>
        )}
        {selectedDoctor && (
          <div className="selected-doctor mt-6" ref={selectedDoctorRef}>
            <h2 className="text-base font-bold mb-4">Selected Doctor</h2>
            <div className="flex items-center mb-4">
              <img
                src={selectedDoctor.user.profile_pic || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                alt={selectedDoctor.user.name}
                className="w-16 h-16 rounded-full mr-4"
              />
              <div>
                <p className="text-lg font-semibold">
                  {selectedDoctor.user.name}
                </p>
                <p className="text-gray-600">{selectedDoctor.specialization}</p>
              </div>
            </div>
            <JoinCall doctor={selectedDoctor} patient={patient} />
          </div>
        )}
      </div>
      <div className="schedule-appointment sm:w-1/2 p-6 bg-white rounded-md shadow-md">
        <h1 className="text-lg text-center font-bold mb-6">
          Schedule a Future Appointment
        </h1>
        <input
          type="text"
          placeholder="Search doctors by name or specialty"
          value={futureSearchTerm}
          onChange={handleFutureSearchChange}
          className="w-full p-3 mb-6 border rounded-md"
        />
        {loading ? (
          <div className="text-center">
            <AiOutlineLoading3Quarters className="animate-spin text-blue-600" />
            <p>Loading doctors...</p>
          </div>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : (
          <div className="doctors-list max-h-60 overflow-y-auto">
            {filteredFutureDoctors.length > 0 ? (
              filteredFutureDoctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className={`doctor-item flex items-center p-3 mb-3 border-b cursor-pointer hover:bg-blue-100 ${
                    selectedFutureDoctor === doctor ? "bg-blue-200" : ""
                  }`}
                  onClick={() => handleDoctorSelect(doctor, true)}
                >
                  <img
                    src={
                      doctor.user.profile_pic ||
                      "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                    }
                    alt={doctor.user.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <p className="font-semibold">{doctor.user.name}</p>
                    <p className="text-gray-600">{doctor.specialization}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-600">No doctors found</p>
            )}
          </div>
        )}
        {selectedFutureDoctor && (
          <div className="selected-doctor mt-6" ref={selectedDoctorFutureRef}>
            <h2 className="text-base font-bold mb-4">Selected Doctor</h2>
            <div className="flex items-center mb-4">
              <img
                src={selectedFutureDoctor.user.profile_pic || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                alt={selectedFutureDoctor.user.name}
                className="w-16 h-16 rounded-full mr-4"
              />
              <div>
                <p className="text-base font-semibold">
                  {selectedFutureDoctor.user.name}
                </p>
                <p className="text-gray-600">
                  {selectedFutureDoctor.specialization}
                </p>
              </div>
            </div>
            <button
              className={`w-full py-3 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition-all flex justify-center items-center ${
                buttonLoading ? "cursor-not-allowed opacity-50" : ""
              }`}
              onClick={() => {
                dispatch(
                  changepage("doctor schedule")
                )}}
              disabled={buttonLoading}
            >
              {buttonLoading ? (
                <>
                  <AiOutlineLoading3Quarters className="animate-spin mr-2" />
                  Loading...
                </>
              ) : (
                "Schedule Appointment"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
