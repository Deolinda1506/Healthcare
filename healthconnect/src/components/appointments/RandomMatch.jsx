import { usePolling } from "./PollingContext";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useState } from "react";
import { createCall } from "../../features/call";
import { useDispatch } from "react-redux";
import { addCallId, changepage } from "../../features/SharedData";
import { useEffect } from "react";
import JoinCall from "./JoinCall";
import { useSelector } from "react-redux";

export default function RandomMatch() {
  const { polling, setPolling, selectedSpecialty, setSelectedSpecialty, matchedDoctor, setMatchedDoctor, doctorInfo, setDoctorInfo } = usePolling();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const specialties = ["General", "Dermatology", "Cardiology"];
  const dispatch = useDispatch();
  const patient = useSelector((state) => state.sharedData.profile.patient.user)

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleSelectSpecialty = (specialty) => {
    setSelectedSpecialty(specialty);
    setDropdownOpen(false);
  };

  useEffect(() => {
    setLoading(false);
  }, [matchedDoctor]);

  const handleMatch = () => {
    setLoading(true);
    setPolling(true);
  };

  const handleRetry = () => {
    setSelectedSpecialty("");
    setPolling(false);
    setMatchedDoctor(null);
    setLoading(false);
  };

  return (
    <div className="random mx-auto w-fit p-6 bg-white rounded-md shadow-md">
      <h1 className="text-2xl font-bold mb-6">Random Matching</h1>
      {!matchedDoctor ? (
        <>
          <div className="dropdown relative mb-6">
            <div
              className="dropdown-btn min-w-[16vw] w-full flex items-center justify-between p-3 bg-gray-200 rounded-md cursor-pointer"
              onClick={toggleDropdown}
            >
              <p>{selectedSpecialty || "Select Specialty"}</p>
              <ArrowDropDownIcon />
            </div>
            {dropdownOpen && (
              <div className="dropdown-content absolute left-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg z-10 w-full">
                {specialties.map((specialty, index) => (
                  <div
                    key={index}
                    className="p-3 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSelectSpecialty(specialty)}
                  >
                    {specialty}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all flex justify-center items-center"
            onClick={handleMatch}
            disabled={loading}
          >
            {loading ? (
              <AiOutlineLoading3Quarters className="animate-spin mr-2" />
            ) : (
              "Match"
            )}
          </button>
        </>
      ) : (
        <div className="text-center">
          <div className="mb-4 flex items-center justify-center">
            <img
              src={matchedDoctor.imageUrl}
              alt={matchedDoctor.name}
              className="w-16 h-16 rounded-full mr-4"
            />
            <div>
              <p className="text-lg font-semibold">{matchedDoctor.name}</p>
              <p className="text-gray-600">{matchedDoctor.specialty}</p>
            </div>
          </div>
          <JoinCall doctor={doctorInfo} patient={patient} />
          <button
            className="w-full py-3 px-4 text-[red] border border-[red] rounded-md hover:bg-red-500 hover:text-white transition-all flex justify-center items-center"
            onClick={handleRetry}
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
}
