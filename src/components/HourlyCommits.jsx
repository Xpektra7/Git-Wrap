import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

import { Line } from "react-chartjs-2";

export default function HourlyCommits({ commitTimeAnalysis, theme }) {
  return (
    <div className="w-full row-span-2 col-span-1">
      {commitTimeAnalysis?.hourDistribution?.length === 24 ? (
        <Line
          data={{
            labels: [...Array(24).keys()].map(
              (h) => h.toString().padStart(2, "0") + ":00"
            ),
            datasets: [
              {
                label: "Commits per Hour",
                data: commitTimeAnalysis.hourDistribution,
                fill: false,
                borderColor: `${theme === "light" ? "#000" : "#fff"}`,
                tension: 0.25,
                borderWidth: 2,
              },
            ],
          }}
          options={{
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
            },
          }}
        />
      ) : (
        <p>No hourly commit data available.</p>
      )}
    </div>
  );
}
