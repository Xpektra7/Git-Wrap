import { useEffect, useState } from "react";
import { getTotalCommits } from "./lib/github";

function App() {
  const [commits, setCommits] = useState(null);

  useEffect(() => {
    getTotalCommits("Xpektra7").then(total => {
      setCommits(total);
    });
  }, []);

  return (
    <div className="text-center text-2xl font-bold">
      {commits === null ? "Loading..." : `Total Commits: ${commits}`}
    </div>
  );
}

export default App;
