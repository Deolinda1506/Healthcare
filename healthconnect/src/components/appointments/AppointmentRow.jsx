import { useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import createAxiosInstance from "../../features/axios";
import { useSelector, useDispatch } from "react-redux";
import Modal from "./Modal";
import toast from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import QRCode from 'qrcode.react';
import { Link } from "react-router-dom";

export default function AppointmentRow({
  appointment,
  index,
  showUpcoming,
  highlight,
  onCancel,
}) {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [diagnosis, setDiagnosis] = useState("");
  const [fullReport, setFullReport] = useState("");
  const [prescription, setPrescription] = useState("");
  const [description, setDescription] = useState("");
  const [dosage, setDosage] = useState("");
  const [loading, setLoading] = useState(false);
  const [existingPrescription, setExistingPrescription] = useState(null);
  const [existingReport, setExistingReport] = useState(null);


  useEffect(() => {
    console.log(profile)
    if (appointment.prescription) {
      setExistingPrescription(appointment.prescription);
      console.log("prescription", appointment);
      setPrescription(appointment.prescription.prescription);
      setDescription(appointment.prescription.description);
      setDosage(appointment.prescription.dosage);
    }
    if (appointment.report) {
      setExistingReport(appointment.report);
      setDiagnosis(appointment.diagnosis);
      setFullReport(appointment.report);
    }
  }, [appointment]);

  const instance = createAxiosInstance();
  const profile = useSelector((state) => state.sharedData.profile.patient);
  const otherUser =
    profile.user.user_role === "Health Professional"
      ? appointment.patient
      : appointment.doctor;

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return format(date, "MMM dd, yyyy h:mm a");
  };

  const handleCancel = async () => {
    try {
      await instance.patch(`/appointments/${appointment.id}/cancel`);
      onCancel(appointment.id);
    } catch (error) {
      console.error("Failed to cancel the appointment:", error);
    }
  };

  const handleSaveReport = async () => {
    setLoading(false);
    try {
      await instance.post(`/appointments/create_report`, {
        appointment_id: appointment.id,
        diagnosis,
        fullReport,
      });
      toast.success("Prescription saved successfully");
      setIsReportModalOpen(false);
    } catch (error) {
      console.error("Failed to save the report:", error);
    }
    setLoading(false);
  };

  const handleSavePrescription = async () => {
    setLoading(true);
    try {
      if (!prescription || !dosage) {
        toast.error("Please fill in all required fields");
        return;
      }
      await instance.post(`appointments/create_prescription`, {
        appointment_id: appointment.id,
        description,
        dosage,
        prescription,
      });
      toast.success("Prescription saved successfully");
      setIsPrescriptionModalOpen(false);
    } catch (error) {
      console.error("Failed to save the prescription:", error);
    }
    setLoading(false);
  };

  const useClickOutside = (handler) => {
    const ref = useRef();

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
          handler();
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [handler]);

    return ref;
  };

  const prescriptionRef = useClickOutside(() => {
    setIsPrescriptionModalOpen(false);
  });

  const reportRef = useClickOutside(() => {
    setIsReportModalOpen(false);
  });

  return (
    <>
      <div
        key={index}
        className={`row flex flex-col sm:flex-row sm:gap-9 items-center mt-4 px-4 ${
          highlight
            ? "bg-[#fffae6] border border-[#ffecb3] rounded px-4 py-2"
            : "bg-white sm:px-0"
        }`}
      >
        <div className="avatar w-16 sm:w-8">
          <img
            src={
              appointment.doctorAvatar ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt={appointment.doctor.user.name}
          />
        </div>
        <div className="name w-full sm:w-1/6 text-[#273240]">
          {otherUser.user.name}
        </div>
        <div className="specialty w-full sm:w-1/6">
          {appointment.doctor.specialization}
        </div>
        <div className="date-time w-full sm:w-1/6 text-[#273240BB]">
          {formatDate(appointment.start)}
        </div>
        {showUpcoming && (
          <div className="flex gap-4 mt-2 sm:mt-0">
            <div
              onClick={() => {
                createCall("");
                dispatch(changepage("call"));
              }}
              className="join px-3 py-1 text-[#5A6ACF] border border-[#32D16D] transition-all cursor-pointer rounded-[5px] bg-[#DDE4F044] hover:bg-[#32D16DAA]"
            >
              Join Call
            </div>
            <div
              onClick={handleCancel}
              className="cancel px-3 py-1 text-[#5A6ACF] border border-[#C42626] transition-all cursor-pointer rounded-[5px] bg-[#DDE4F044] hover:bg-red-200"
            >
              Cancel Appointment
            </div>
          </div>
        )}
        {!showUpcoming && profile.user.user_role === "Patient" && (
          <div className="flex gap-4 mt-2 sm:mt-0" onClick={() => existingReport && setIsReportModalOpen(true)}>
            <div className="report px-3 py-1 text-[#5A6ACF] border border-[#DDE4F0] transition-all cursor-pointer rounded-[5px] bg-[#DDE4F044] hover:bg-blue-200">
              {existingReport ? "View Report" : "No Report Available Yet"}
            </div>
          </div>
        )}
        {!showUpcoming && profile.user.user_role === "Patient" && (
          <div className={`flex gap-4 mt-2 sm:mt-0 ${!existingPrescription && "hidden"}`} onClick={() => existingPrescription && setIsPrescriptionModalOpen(true)}>
            <div className="report px-3 py-1 text-[#5A6ACF] border border-[#DDE4F0] transition-all cursor-pointer rounded-[5px] bg-[#DDE4F044] hover:bg-blue-200">
              {existingPrescription ? "View Prescription" : ""}
            </div>
          </div>
        )}
        {!showUpcoming && profile.user.user_role === "Health Professional" && (
          <div className="flex gap-4 mt-2 sm:mt-0">
            <div
              onClick={() => setIsReportModalOpen(true)}
              className="report px-3 py-1 text-[#5A6ACF] border border-[#DDE4F0] transition-all cursor-pointer rounded-[5px] bg-[#DDE4F044] hover:bg-blue-200"
            >
              {existingReport ? "View Report" : "Write Report"}
            </div>
            <div
              onClick={() => setIsPrescriptionModalOpen(true)}
              className="prescription px-3 py-1 text-[#5A6ACF] border border-[#DDE4F0] transition-all cursor-pointer rounded-[5px] bg-[#DDE4F044] hover:bg-blue-200"
            >
              {existingPrescription
                ? "View Prescription"
                : "Write Prescription"}
            </div>
          </div>
        )}
      </div>
      <hr className="w-full mt-4" />

      {/* Report Modal */}
      <Modal
        title={existingReport ? "View Report" : "Write Report"}
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        ref={reportRef}
      >
        {existingReport ? (
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Diagnosis
              </label>
              <textarea
                value={diagnosis}
                readOnly
                className="w-full p-2 border border-gray-300 rounded mt-1 mb-4 bg-gray-100"
              ></textarea>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Full Report
              </label>
              <textarea
                value={fullReport}
                readOnly
                className="w-full p-2 border border-gray-300 rounded mb-4 bg-gray-100"
              ></textarea>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Diagnosis
              </label>
              <textarea
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && handleSaveReport()
                }
                className="w-full p-2 border border-gray-300 rounded mt-1 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter the diagnosis"
              ></textarea>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Full Report
              </label>
              <textarea
                value={fullReport}
                onKeyDown={(e) =>
                  e.key === "Enter" && handleSaveReport()
                }
                onChange={(e) => setFullReport(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Write your full report here"
              ></textarea>
            </div>
            <button
              onClick={handleSaveReport}
              className="border border-blue-500 text-blue-500 p-2 rounded-lg hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {loading ? (
                <AiOutlineLoading3Quarters className="animate-spin mr-2" />
              ) : (
                "Save Report"
              )}
            </button>
          </div>
        )}
      </Modal>

      {/* Prescription Modal */}
      <Modal
        title={
          existingPrescription ? "View Prescription" : "Write Prescription"
        }
        isOpen={isPrescriptionModalOpen}
        onClose={() => setIsPrescriptionModalOpen(false)}
        ref={prescriptionRef}
      >
        {existingPrescription ? (
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Prescription
              </label>
              <textarea
                value={prescription}
                readOnly
                className="w-full p-2 border border-gray-300 rounded mt-1 mb-4 bg-gray-100"
              ></textarea>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Dosage
              </label>
              <input
                type="text"
                value={dosage}
                readOnly
                className="w-full p-2 border border-gray-300 rounded mt-1 mb-4 bg-gray-100"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={description}
                readOnly
                className="w-full p-2 border border-gray-300 rounded mt-1 mb-4 bg-gray-100"
              ></textarea>
            </div>
            <div className="mb-4 flex flex-col gap-1 items-center">
              <label className="block text-sm font-medium text-gray-700">
                Prescription QR Code
              </label>
              <QRCode value={appointment.prescription != null && appointment.prescription.unique_link} size={128} />
              <span className="flex flex-col gap-1 items-center">
                <p>Or</p>
                <Link className="text-blue-500 text-center" to={appointment.prescription != null && appointment.prescription.unique_link}>{appointment.prescription != null && appointment.prescription.unique_link}</Link>
              </span>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Prescription
              </label>
              <textarea
                value={prescription}
                onChange={(e) => setPrescription(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  e.preventDefault() &&
                  handleSavePrescription()
                }
                className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Write your prescription here"
              ></textarea>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Dosage
              </label>
              <input
                type="text"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSavePrescription()}
                className="w-full p-2 border border-gray-300 rounded mt-1 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter the dosage"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSavePrescription()}
                className="w-full p-2 border border-gray-300 rounded mt-1 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter a description (optional)"
              ></textarea>
            </div>
            <button
              onClick={handleSavePrescription}
              className="border border-blue-500 text-blue-500 p-2 rounded-lg hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              {loading ? (
                <AiOutlineLoading3Quarters className="animate-spin mr-2" />
              ) : (
                "Save Prescription"
              )}
            </button>
          </div>
        )}
      </Modal>
    </>
  );
}
