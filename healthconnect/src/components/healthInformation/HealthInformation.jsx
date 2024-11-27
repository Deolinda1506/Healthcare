import { useState, useEffect } from "react";
import PersonalHealth from "./PersonalHealth";
import createAxiosInstance from "../../features/axios";
import HealthMetricChart from "./HealthMetricChart";

export default function HealthInformation() {
    const instance = createAxiosInstance();
    const [healthMetrics, setHealthMetrics] = useState({});
    const [loading, setLoading] = useState(true);
    const [metrics, setMetrics] = useState(null);

    useEffect(() => {
        const fetchHealthMetrics = async () => {
            try {
                const res = await instance.get('/get_health_metrics');
                const data = res.data;

                // Transform the data into a grouped object
                const groupedData = await data.past_metrics.reduce((acc, item) => {
                    const date = item.created_at.split('T')[0];
                    
                    // Create entries for each metric type if they don't exist
                    if (!acc.bmi) acc.bmi = [];
                    if (!acc.blood_glucose) acc.blood_glucose = [];
                    if (!acc.blood_pressure) acc.blood_pressure = [];
                    
                    // Push data into the respective arrays
                    acc.bmi.push({ date, value: item.bmi });
                    acc.blood_glucose.push({ date, value: item.blood_glucose });
                    acc.blood_pressure.push({ date, value: item?.blood_pressure?.split('/')[0] });
                    
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

    const normalLimits = {
        bmi: { lower: 18.5, upper: 24.9 },
        blood_glucose: { lower: 70, upper: 140 },
        blood_pressure: { lower: 90, upper: 120 },
        // Add other metrics if needed
    };

    return (
        <div>
            <div className="flex justify-around">
                <PersonalHealth metrics={healthMetrics.metrics} />
                <div className="line w-[1px] h-[70vh] bg-gray-300"></div>
                <HealthMetricChart data={healthMetrics} normalLimits={normalLimits} />
            </div>
        </div>
    );
}
