import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { Dispatch } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Activity } from "../types";

type ShowSummaryProps = {
    activities: Activity[];
    setShowSummary: Dispatch<React.SetStateAction<boolean>>;
};

export default function ShowSummary({ activities, setShowSummary }: ShowSummaryProps) {
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const chartInstance = useRef<Chart | null>(null);

    useEffect(() => {
        if (!chartRef.current) return;

        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        // Obtener fechas únicas ordenadas
        const labels = [...new Set(activities.map((activity) => activity.date))].sort();

        // Extraer calorías según categoría
        const foodCalories = labels.map((date) => {
            return activities
                .filter((activity) => activity.category === 1 && activity.date === date)
                .reduce((sum, act) => sum + act.calories, 0);
        });

        const exerciseCalories = labels.map((date) => {
            return activities
                .filter((activity) => activity.category === 2 && activity.date === date)
                .reduce((sum, act) => sum + act.calories, 0);
        });

        const ctx = chartRef.current.getContext("2d");
        if (!ctx) return;

        chartInstance.current = new Chart(ctx, {
            type: "line",
            data: {
                labels,
                datasets: [
                    {
                        label: "Calorías (Comida)",
                        data: foodCalories,
                        borderColor: "rgb(211, 113, 33)",
                        backgroundColor: "rgba(211, 113, 33, 0.2)",
                        borderWidth: 2,
                        pointRadius: 5,
                        fill: true,
                    },
                    {
                        label: "Calorías (Ejercicio)",
                        data: exerciseCalories,
                        borderColor: "rgba(75, 192, 192, 1)",
                        backgroundColor: "rgba(75, 192, 192, 0.2)",
                        borderWidth: 2,
                        pointRadius: 5,
                        fill: true,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { title: { display: true, text: "Fecha" } },
                    y: { title: { display: true, text: "Calorías" } },
                },
            },
        });

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [activities]);

    return (
        <div className="fixed top-0 bottom-0 left-0 right-0 m-auto w-[90%] h-[80%] bg-white z-10 rounded-lg shadow-lg p-4">
            <button className="absolute top-3 right-3" onClick={() => setShowSummary(false)}>
                <XMarkIcon className="text-red-600 w-8 h-8 rounded-lg hover:bg-red-600 hover:text-white" />
            </button>
            <div className="w-full h-full flex justify-center items-center">
                <canvas ref={chartRef}></canvas>
            </div>
        </div>
    );
}