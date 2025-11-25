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
import { Card } from "./ui/card";

interface HourlyProps {
  commitTimeAnalysis: any;
  prevCommitTimeAnalysis: any;
  theme?: string;
  year: number;
  prevYear: number;
}

export default function HourlyCommits({ commitTimeAnalysis, prevCommitTimeAnalysis, theme, year, prevYear }: HourlyProps) {
  return (
    <Card className="w-full h-full row-span-1 md:row-span-2 col-span-1 p-2">
      {commitTimeAnalysis?.hourDistribution?.length === 24 ? (
        <Line
          data={{
            labels: [...Array(24).keys()].map((h) => h.toString().padStart(2, "0") + ":00"),
            datasets: [
              {
                label: `Commits per Hour (${year})`,
                data: commitTimeAnalysis.hourDistribution,
                fill: false,
                borderColor: `${theme === "light" ? "oklch(0.145 0 0)" : "oklch(1 0 0)"}`,
                tension: 0.25,
                borderWidth: 2,
                pointBorderColor: `${theme === "light" ? "oklch(0.145 0 0)" : "oklch(1 0 0)"}`,
              },
              {
                label: `Commits per Hour (${prevYear})`,
                data: prevCommitTimeAnalysis.hourDistribution,
                fill: false,
                borderColor: `${theme === "light" ? "oklch(0.556 0 0)" : "oklch(0.5 0 0)"}`,
                tension: 0.25,
                borderWidth: 2,
                pointBorderColor: `${theme === "light" ? "oklch(0.556 0 0)" : "oklch(0.5 0 0)"}`,
              },
            ],
          }}
          options={{
            maintainAspectRatio: false,
            font: { family: 'Mozilla Text, Inter, system-ui' },
            plugins: {
              legend: { display: true, position: "bottom" },
              title: {
                display: true, text: "Hourly Commits", font: { family: 'Jetbrains Mono' },
              },
            },
            scales: {
              x: {
                grid: {color : 'oklch(1 0 0 / 10%)'}
              },
              y: {
                grid: {color : 'oklch(1 0 0 / 10%)'}
              }
            }
          }}
        />
      ) : (
        <p>No hourly commit data available.</p>
      )}
    </Card>
  );
}
