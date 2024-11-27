import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceLine,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { format } from "date-fns";
import createAxiosInstance from "../../features/axios";
import Appointments from "../appointments/Appointments";
import JoinCall from "../appointments/JoinCall";
import { Button } from "@mui/material";
import { useDispatch } from "react-redux";
import { changepage } from "../../features/SharedData";

export default function DoctorDash() {
  const [healthMetrics, setHealthMetrics] = useState({});
  const [loading, setLoading] = useState(true);
  const [appointmentsData, setAppointmentsData] = useState(null);
  const [futureAppointments, setFutureAppointments] = useState(null);
  const [pastAppointments, setPastAppointments] = useState(null);
  const dispatch = useDispatch();
  const instance = createAxiosInstance();

  const getUpcomingAppointments = () => {
    setLoading(true);
    instance
      .get("appointments/get_all_future_appointments")
      .then((response) => {
        setFutureAppointments(response.data.future_appointments);
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
    getUpcomingAppointments();
    getPastAppointments();
  }, []);

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return format(date, "MMM dd, yyyy h:mm a");
  };
  useEffect(() => {
    const fetchAppointmentsData = async () => {
      try {
        const res = await instance.get(
          "appointments/get_all_past_appointments"
        );
        const { completed_appointments, missed_appointments } = res.data;

        setAppointmentsData({
          completed: completed_appointments.length,
          missed: missed_appointments.length,
        });
      } catch (error) {
        console.error("Failed to fetch appointments data:", error);
      }
    };

    fetchAppointmentsData();
  }, []);
  return (
    <div>
      <div className="bottom-half grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 h-[42vh] border-b border-gray-300">
        <div className="upcoming p-4 bg-white shadow rounded-lg">
          <p className="font-semibold text-lg mb-3">Upcoming Appointments</p>
          <div className="appointments space-y-4">
            {!loading &&
              futureAppointments?.map((appointment, index) => (
                <div
                  key={index}
                  className="row flex gap-2 items-center justify-between border-b pb-2"
                >
                  <div className="name font-medium text-gray-800">
                    {appointment.doctor.user.name}
                  </div>
                  <div className="specialization text-sm text-gray-600">
                    {appointment?.doctor.specialization}
                  </div>
                  <div className="time text-sm text-gray-500">
                    {formatDate(appointment?.start)}
                  </div>
                  <Button
                    sx={{ fontSize: 12, padding: 1 }}
                    variant="outlined"
                    onClick={() => dispatch(changepage("appointments"))}
                  >
                    See More
                  </Button>
                </div>
              ))}
          </div>
        </div>
        <div className="past p-4 bg-white shadow rounded-lg">
          <p className="font-semibold text-lg mb-3">Past Appointments</p>
          <div className="appointments space-y-4">
            {!loading &&
              pastAppointments?.map((appointment, index) => (
                <div
                  key={index}
                  className="row flex gap-2 items-center justify-between border-b pb-2"
                >
                  <div className="name font-medium text-gray-800">
                    {appointment.doctor.user.name}
                  </div>
                  <div className="specialization text-sm text-gray-600">
                    {appointment?.doctor.specialization}
                  </div>
                  <div className="time text-sm text-gray-500">
                    {formatDate(appointment?.start)}
                  </div>
                  <Button
                    sx={{ fontSize: 12, padding: 1 }}
                    variant="outlined"
                    onClick={() => dispatch(changepage("appointments"))}
                  >
                    See More
                  </Button>
                </div>
              ))}
          </div>
        </div>
      </div>
      
    </div>
  );
}
