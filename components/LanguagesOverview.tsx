import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

import { Bar } from "react-chartjs-2";
import { getLanguagesBreakdown } from "../lib/github";
import { useEffect, useState } from "react";
import { Card } from "./ui/card";

interface LanguagesOverviewProps {
  username: string;
  year: number;
  theme?: string;
}

export default function LanguageOverview({ username, year, theme }: LanguagesOverviewProps) {
  const [languagesBreakdown, setLanguagesBreakdown] = useState<any | null>(null);

  useEffect(() => {
    getLanguagesBreakdown(username, String(year)).then((r: any) => setLanguagesBreakdown(r));
  }, [username, year]);

  const aggregate = languagesBreakdown?.aggregate || {};

  const topKeys = Object.entries(aggregate)
    .sort((a: any, b: any) => b[1] - a[1])
    .slice(0, 6)
    .map(([lang]: any) => lang);

  const filtered = Object.keys(aggregate)
    .filter((lang) => topKeys.includes(lang))
    .reduce((obj: any, lang: string) => {
      obj[lang] = aggregate[lang];
      return obj;
    }, {});

  return (
    <Card className="w-full h-full row-span-1 md:row-span-2 col-span-1 p-2">
      {Object.keys(filtered).length > 0 ? (
        <Bar
          data={{
            labels: Object.keys(filtered),
            datasets: [
              {
                label: "Repos per Language",
                data: Object.values(filtered),
                backgroundColor: theme === "light" ? "#000" : "#e3e3e3",
                borderRadius: 7,
              },
            ],
          }}
          options={{
            
            maintainAspectRatio: false,
            font: { family: 'Mozilla Text, Inter, system-ui' },
            plugins: {
              legend: { display: false },
              title: {
                display: true, text: "Repos per Language", font: { family: 'Jetbrains Mono' },
              },
            },
            scales: {
              x: {
                grid: {color : 'oklch(1 0 0 / 10%)'}
              },
              y: {
                beginAtZero: true,
                grid: {color : 'oklch(1 0 0 / 10%)'}
              }
            }
          }}
        />
      ) : (
        <p>No language data available.</p>
      )}
    </Card>
  );
}
