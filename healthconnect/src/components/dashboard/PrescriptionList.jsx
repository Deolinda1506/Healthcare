import React, { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material";
import { AiOutlineFilePdf } from "react-icons/ai";
import { MdClose } from "react-icons/md";
import createAxiosInstance from "../../features/axios";
import { useEffect } from "react";
import Modal from "../appointments/Modal";
import QRCode from "qrcode.react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { firestore } from "../../../main";

function PrescriptionList() {
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const instance = createAxiosInstance();
  const profile = useSelector((state) => state.sharedData.profile.patient);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await instance.get("/appointments/get_past_appointments");
        setAppointments(response.data);
      }
      catch (error) {
        toast.error(error);
      }
    }

    fetchAppointments();
  }, []);

  const handleViewDetails = (prescription) => {
    setSelectedPrescription(prescription);
    setIsPrescriptionModalOpen(true);
  };

  const handleGrantRefill = (appointment) => {
    console.log(appointment)
    instance.post("/appointments/grant_refill", {
      prescription_id: appointment.prescription.id,
    })
    .then(async () => {
      const notificationData = {
        type: "granted_refill",
        prescription_id: appointment.prescription.id,
        read: false,
        userId: appointment.patient.user.id,
        message: `${appointment.doctor.user.name} has granted your refill of ${appointment.prescription.prescription}.`,
        created: new Date().toISOString(),
      };

      try {
        await firestore.collection("notifications").add(notificationData);
        console.log("Notification saved successfully");
      } catch (error) {
        console.error("Error saving notification:", error);
      }
      toast.success("Refill granted!");
    })
  };

  const handleAskForRefill = (prescription) => {
    instance.post("/appointments/ask_for_refill", {
      prescription_id: prescription.prescription.id,
    })
    .then(async () => {
      const notificationData = {
        type: "refill",
        prescription_id: prescription.prescription.id,
        read: false,
        userId: prescription.doctor.user.id,
        message: `${prescription.patient.user.name} has requested a refill of ${prescription.prescription.prescription}.`,
        created: new Date().toISOString(),
      };

      try {
        await firestore.collection("notifications").add(notificationData);
        console.log("Notification saved successfully");
      } catch (error) {
        console.error("Error saving notification:", error);
      }


    })
    toast.success("Refill request submitted!");
    setSelectedPrescription(null);
  };

  const handleClose = () => {
    setSelectedPrescription(null);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">
        Prescriptions
      </h1>
      <div className="grid gap-2">
        {appointments.length === 0 && (
          <p className="text-gray-600 text-center font-semibold">No Prescriptions Found</p>
        )}
        {appointments.map((appointment) => (
          appointment.prescription &&
          <div
            key={appointment.id}
            className="px-4 py-2 border-b border-gray-300 rounded-lg flex justify-between items-center bg-slate-100"
          >
            <div>
              <Typography variant="h6" component="h3" className="font-semibold text-blue-600">
                {appointment.prescription.prescription}
              </Typography>
              <Typography variant="body2" className="text-gray-600">
                {appointment.prescription.description}
              </Typography>
              <Typography variant="body1" className="text-gray-900 font-bold">
                {appointment.prescription.dosage}
              </Typography>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outlined"
                color="primary"
                onClick={() => handleViewDetails(appointment)}
              >
                View Details
              </Button>
              {profile.user.user_role === "Patient" && appointment.prescription.refill_request == false &&
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleAskForRefill(appointment)}
              >
                Ask for Refill
              </Button>
  }
  {profile.user.user_role === "Patient" && appointment.prescription.refill_request == true &&
              <Button
                variant="contained"
                color="primary"
                disabled={true}
              >
                Refill Requested
              </Button>}
              {profile.user.user_role === "Health Professional" && appointment.prescription.refill_request == true
              && <Button
                variant="contained"
                color="primary"
                onClick={() => handleGrantRefill(appointment)}
              >
                Grant Refill
              </Button>}
            </div>
          </div>
        ))}
      </div>

      {selectedPrescription && (
      <Modal
      title={
        "View Prescription"
      }
      isOpen={isPrescriptionModalOpen}
      onClose={() => setIsPrescriptionModalOpen(false)}
    >
        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Prescription
            </label>
            <textarea
              value={selectedPrescription.prescription.prescription}
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
              value={selectedPrescription.prescription.dosage}
              readOnly
              className="w-full p-2 border border-gray-300 rounded mt-1 mb-4 bg-gray-100"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={selectedPrescription.prescription.description}
              readOnly
              className="w-full p-2 border border-gray-300 rounded mt-1 mb-4 bg-gray-100"
            ></textarea>
          </div>
          <div className="mb-4 flex flex-col gap-1 items-center">
            <label className="block text-sm font-medium text-gray-700">
              Prescription QR Code
            </label>
            <QRCode value={selectedPrescription.prescription != null && selectedPrescription.prescription.unique_link} size={128} />
            <span className="flex flex-col gap-1 items-center">
              <p>Or</p>
              <Link className="text-blue-500 text-center" to={selectedPrescription.prescription != null && selectedPrescription.prescription.unique_link}>{selectedPrescription.prescription != null && selectedPrescription.prescription.unique_link}</Link>
            </span>
          </div>
        </div>
      
    </Modal>      )}
    </div>
  );
}

export default PrescriptionList;
