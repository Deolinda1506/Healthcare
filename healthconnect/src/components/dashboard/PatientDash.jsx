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

const COLORS = ["#0088FE", "#FFBB28"];

export default function PatientDash() {
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
    const fetchHealthMetrics = async () => {
      try {
        const res = await instance.get("/get_health_metrics");
        const data = res.data;

        const groupedData = data.past_metrics.reduce((acc, item) => {
          const date = item.created_at.split("T")[0];

          if (!acc.bmi) acc.bmi = [];
          if (!acc.blood_glucose) acc.blood_glucose = [];
          if (!acc.blood_pressure) acc.blood_pressure = [];

          acc.bmi.push({ date, value: item.bmi });
          acc.blood_glucose.push({ date, value: item.blood_glucose });
          acc.blood_pressure.push({ date, value: item.blood_pressure });

          return acc;
        }, {});
        setHealthMetrics(groupedData);
      } catch (error) {
        console.error("Failed to fetch health metrics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHealthMetrics();
  }, []);

  useEffect(() => {
    console.log(healthMetrics);
  }, [healthMetrics]);

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

  const normalLimits = {
    bmi: { lower: 18.5, upper: 24.9 },
    blood_glucose: { lower: 70, upper: 140 },
    blood_pressure: { lower: 90, upper: 120 },
  };

  const data = healthMetrics;

  return (
    <div className="mx-7 mt-4">
      <h1 className="text-2xl -mt-1 mb-1">Dashboard</h1>
      <hr className="w-20 border-t-2 mt-2 border-blue-800" />
      <div className="top-half flex justify-between">
        <div className="BMI border-b -mx-7 shadow-md rounded h-[50vh] w-1/3 p-2 px-8 text-gray-600">
          <p className="font-semibold">BMI (Body Mass Index)</p>
          <hr className="w-full mt-3" />
          <span className="text-sm">
            Current:{" "}
            {Math.round(
              healthMetrics.bmi?.[healthMetrics.bmi.length - 1]?.value * 100
            ) / 100}{" "}
            (
            {healthMetrics.bmi?.[healthMetrics.bmi.length - 1]?.value >=
            normalLimits.bmi.upper
              ? "Over"
              : healthMetrics.bmi?.[healthMetrics.bmi.length - 1]?.value <=
                normalLimits.bmi.lower
              ? "Under"
              : "Normal"}{" "}
            Weight)
          </span>
          {!loading && healthMetrics.bmi && (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart
                data={healthMetrics.bmi}
                margin={{
                  top: 20,
                  right: 20,
                  left: 0,
                  bottom: 20,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "#12B536", fontSize: 12 }}
                  stroke="#8884d8"
                  tickLine={{ stroke: "#8884d8", strokeWidth: 1 }}
                />
                <YAxis
                  tick={{ fill: "#12B536", fontSize: 12 }}
                  stroke="#8884d8"
                  tickLine={{ stroke: "#8884d8", strokeWidth: 1 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    borderColor: "#ddd",
                  }}
                  labelStyle={{ color: "#8884d8" }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={{ stroke: "#8884d8", strokeWidth: 2 }}
                />
                <ReferenceLine
                  y={normalLimits["bmi"]?.lower}
                  label="Lower Normal"
                  stroke="red"
                  strokeDasharray="3 3"
                />
                <ReferenceLine
                  y={normalLimits["bmi"]?.upper}
                  label="Upper Limit"
                  stroke="red"
                  strokeDasharray="3 3"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
          {loading && (
            <AiOutlineLoading3Quarters className="w-10 h-10 animate-spin" />
          )}
        </div>
        <div className="BMI border-b -mx-7 shadow-md rounded h-[50vh] w-1/3 p-2 px-8 text-gray-600">
          <p className="font-semibold">Blood Glucose</p>
          <hr className="w-full mt-3" />
          <span className="text-sm">
            Current:{" "}
            {Math.round(
              healthMetrics.blood_glucose?.[
                healthMetrics.blood_glucose.length - 1
              ]?.value * 100
            ) / 100}{" "}
            mg/dL
          </span>
          {!loading && healthMetrics.blood_glucose && (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart
                data={healthMetrics.blood_glucose}
                margin={{
                  top: 20,
                  right: 20,
                  left: 0,
                  bottom: 20,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "#12B536", fontSize: 12 }}
                  stroke="#8884d8"
                  tickLine={{ stroke: "#8884d8", strokeWidth: 1 }}
                />
                <YAxis
                  tick={{ fill: "#12B536", fontSize: 12 }}
                  stroke="#8884d8"
                  tickLine={{ stroke: "#8884d8", strokeWidth: 1 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    borderColor: "#ddd",
                  }}
                  labelStyle={{ color: "#8884d8" }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#5A6ACF"
                  strokeWidth={2}
                  dot={{ stroke: "#8884d8", strokeWidth: 2 }}
                />
                <ReferenceLine
                  y={normalLimits["blood_glucose"]?.lower}
                  label="Lower Normal"
                  stroke="red"
                  strokeDasharray="3 3"
                />
                <ReferenceLine
                  y={normalLimits["blood_glucose"]?.upper}
                  label="Upper Limit"
                  stroke="red"
                  strokeDasharray="3 3"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
          {loading && (
            <AiOutlineLoading3Quarters className="w-10 h-10 animate-spin" />
          )}
        </div>
        <div className="Appointments border-b -mx-7 shadow-md rounded h-[50vh] w-1/3 p-2 px-8 text-gray-600">
          <p className="font-semibold">Appointments Overview</p>
          {appointmentsData ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={[
                    { name: "Completed", value: appointmentsData.completed },
                    { name: "Missed", value: appointmentsData.missed },
                  ]}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {[
                    { name: "Completed", value: appointmentsData.completed },
                    { name: "Missed", value: appointmentsData.missed },
                  ].map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <AiOutlineLoading3Quarters className="w-10 h-10 animate-spin" />
          )}
        </div>
      </div>
      <hr className="w-full mt-4" />
      <div className="bottom-half grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <div className="upcoming p-4 bg-white shadow rounded-lg">
          <p className="font-semibold text-lg mb-3">Upcoming Appointments</p>
          <div className="appointments space-y-4">
            {!loading &&
              futureAppointments?.map((appointment, index) => (
                <div
                  key={index}
                  className="row flex gap-2 items-center justify-between border-b pb-2"
                >
                  <div className="name font-medium text-gray-800">{appointment.doctor.user.name}</div>
                  <div className="specialization text-sm text-gray-600">{appointment?.doctor.specialization}</div>
                  <div className="time text-sm text-gray-500">{formatDate(appointment?.start)}</div>
                  <Button sx={{ fontSize: 12, padding: 1 }} variant="outlined" onClick={() => dispatch(changepage("appointments"))}>See More</Button >
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
                  <div className="name font-medium text-gray-800">{appointment.doctor.user.name}</div>
                  <div className="specialization text-sm text-gray-600">{appointment?.doctor.specialization}</div>
                  <div className="time text-sm text-gray-500">{formatDate(appointment?.start)}</div>
                  <Button sx={{ fontSize: 12, padding: 1 }} variant="outlined" onClick={() => dispatch(changepage("appointments"))}>See More</Button >
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
