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

import { getActivityPatterns } from "../lib/github";
import { useEffect, useState } from "react";

type DayPattern = { day: string; commits: number };

interface DailyCommitsProps {
  username: string;
  theme?: string;
  year: number;
}

export default function DailyCommits({ username, theme, year }: DailyCommitsProps) {
  const [commitTimeAnalysis, setCommitTimeAnalysis] = useState<DayPattern[] | null>(null);
  const [prevCommitTimeAnalysis, setPrevCommitTimeAnalysis] = useState<DayPattern[] | null>(null);

  useEffect(() => {
    getActivityPatterns(username, String(year)).then((r: any) => setCommitTimeAnalysis(r as DayPattern[]));
    getActivityPatterns(username, String(year - 1)).then((r: any) => setPrevCommitTimeAnalysis(r as DayPattern[]));
  }, [username, year]);

  return (
    <div className="w-full h-full row-span-1 md:row-span-2 col-span-1">
      {commitTimeAnalysis && prevCommitTimeAnalysis && commitTimeAnalysis.length === 7 ? (
        <Line
          data={{
            labels: commitTimeAnalysis.map((day) => day.day),
            datasets: [
              {
                label: `Commits per Day (${year})`,
                data: commitTimeAnalysis.map((day) => day.commits),
                fill: false,
                borderColor: `${theme === "light" ? "#000" : "#fff"}`,
                tension: 0.25,
                borderWidth: 2,
                pointBorderColor: `${theme === "light" ? "#000" : "#fff"}`,
              },
              {
                label: `Commits per Day (${year - 1})`,
                data: prevCommitTimeAnalysis.map((day) => day.commits),
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
            plugins: {
              legend: { display: true },
            },
          }}
        />
      ) : (
        <p>No daily commit data available.</p>
      )}
    </div>
  );
}
