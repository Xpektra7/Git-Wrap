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

interface HourlyProps {
  commitTimeAnalysis: any;
  prevCommitTimeAnalysis: any;
  theme?: string;
  year: number;
  prevYear: number;
}

export default function HourlyCommits({ commitTimeAnalysis, prevCommitTimeAnalysis, theme, year, prevYear }: HourlyProps) {
  return (
    <div className="w-full h-full row-span-1 md:row-span-2 col-span-1">
      {commitTimeAnalysis?.hourDistribution?.length === 24 ? (
        <Line
          data={{
            labels: [...Array(24).keys()].map((h) => h.toString().padStart(2, "0") + ":00"),
            datasets: [
              {
                label: `Commits per Hour (${year})`,
                data: commitTimeAnalysis.hourDistribution,
                fill: false,
                borderColor: `${theme === "light" ? "#000" : "#fff"}`,
                tension: 0.25,
                borderWidth: 2,
                pointBorderColor: `${theme === "light" ? "#000" : "#fff"}`,
              },
              {
                label: `Commits per Hour (${prevYear})`,
                data: prevCommitTimeAnalysis.hourDistribution,
                fill: false,
                borderColor: `${theme === "light" ? "#b3b3b3" : "#4d4d4d"}`,
                tension: 0.25,
                borderWidth: 2,
                pointBorderColor: `${theme === "light" ? "#b3b3b3" : "#4d4d4d"}`,
              },
            ],
          }}
          options={{
            maintainAspectRatio: false,
            font: { family: 'Mozilla Text, Inter, system-ui' },
            plugins: {
              legend: { display: true },
            },
          }}
        />
      ) : (
        <p>No hourly commit data available.</p>
      )}
    </div>
  );
}
