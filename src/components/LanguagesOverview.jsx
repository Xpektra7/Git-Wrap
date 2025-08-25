import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

import { Bar } from "react-chartjs-2";

export default function LanguageOverview({ languagesBreakdown, theme }) {
  const aggregate = languagesBreakdown?.aggregate || {};

  return (
    <div className="w-full h-full row-span-2 col-span-1">
      {Object.keys(aggregate).length > 0 ? (
        <Bar
          data={{
            labels: Object.keys(aggregate),
            datasets: [
              {
                label: "Commits per Language",
                data: Object.values(aggregate),
                backgroundColor: theme === "light" ? "#000" : "#fff",
              },
            ],
          }}
          options={{
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
            },
            scales: {
              y: { beginAtZero: true },
            },
          }}
        />
      ) : (
        <p>No language data available.</p>
      )}
    </div>
  );
}
