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
import { getLanguagesBreakdown } from "../lib/github";
import { useEffect, useState } from "react";

export default function LanguageOverview({username,year, theme}) {

  const [languagesBreakdown, setLanguagesBreakdown] = useState();

  // Fetch languages breakdown data
  useEffect(() => {
    getLanguagesBreakdown(username,year).then(setLanguagesBreakdown);
  }, [username, year]);


  const aggregate = languagesBreakdown?.aggregate || {};

  // Get entries, sort by commits (desc), take top 6, but restore original order
  const topKeys = Object.entries(aggregate)
    .sort((a, b) => b[1] - a[1]) // sort by commits
    .slice(0, 6) // pick top 6
    .map(([lang]) => lang); // extract just the keys

  // Preserve original order by filtering
  const filtered = Object.keys(aggregate)
    .filter((lang) => topKeys.includes(lang))
    .reduce((obj, lang) => {
      obj[lang] = aggregate[lang];
      return obj;
    }, {});

  return (
    <div className="w-full h-full row-span-1 md:row-span-2 col-span-1">
      {Object.keys(filtered).length > 0 ? (
        <Bar
          data={{
            labels: Object.keys(filtered),
            datasets: [
              {
                label: "Repos per Language",
                data: Object.values(filtered),
                backgroundColor: theme === "light" ? "#000" : "#e3e3e3",
                borderRadius: '7',
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
