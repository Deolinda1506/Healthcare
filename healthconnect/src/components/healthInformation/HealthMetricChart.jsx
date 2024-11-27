import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { MenuItem, Select, FormControl, InputLabel } from "@mui/material";

export default function HealthMetricChart({ data, normalLimits, dashboard }) {
  const [selectedMetric, setSelectedMetric] = useState("bmi");

  const metricsOptions = [
    { label: "BMI", value: "bmi" },
    { label: "Blood Glucose", value: "blood_glucose" },
    { label: "Blood Pressure", value: "blood_pressure" },
  ];

  const handleChange = (event) => {
    setSelectedMetric(event.target.value);
  };

  return (
    <div className="mx-4 flex flex-col gap-6 w-full max-w-lg bg-white p-6 pb-3 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <span className="text-xl font-semibold text-blue-600">
          {!dashboard && "Health Metric Chart"}
        </span>
        {!dashboard && (        
        <FormControl variant="outlined" size="small" className="w-48">
          <InputLabel>Metric</InputLabel>
          <Select
            value={selectedMetric}
            onChange={handleChange}
            label="Metric"
            className="custom-select"
          >
            {metricsOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        )}
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data[selectedMetric]}
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
            tick={{ fill: "#8884d8", fontSize: 12 }}
            stroke="#8884d8"
            tickLine={{ stroke: "#8884d8", strokeWidth: 1 }}
          />
          <YAxis
            tick={{ fill: "#8884d8", fontSize: 12 }}
            stroke="#8884d8"
            tickLine={{ stroke: "#8884d8", strokeWidth: 1 }}
          />
          <Tooltip
            contentStyle={{ backgroundColor: "#fff", borderColor: "#ddd" }}
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
            y={normalLimits[selectedMetric]?.lower}
            label="Lower Normal"
            stroke="red"
            strokeDasharray="3 3"
          />
          <ReferenceLine
            y={normalLimits[selectedMetric]?.upper}
            label="Upper Limit"
            stroke="red"
            strokeDasharray="3 3"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
