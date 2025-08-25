import { useState, useEffect } from "react";
import Stats from "./Stats";

export default function App() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [validUser, setValidUser] = useState(null);
  const [theme, setTheme] = useState("light");
  const year = 2025;

  useEffect(() => {
    if (!username) return;
    (async () => {
      const res = await fetch(`https://api.github.com/users/${username}`);
      setValidUser(res.ok);
    })();
  }, [username]);

  return (
    <main className="min-h-screen w-screen p-4 px-8 md:px-16 flex flex-col gap-8">
      <div className="flex w-full justify-between">
        <div className="flex gap-4 items-center">
          <input
            type="text"
            className="outline-none rounded border border-(--border) w-40 p-1 px-2 text-sm"
            onChange={(e) => setName(e.target.value)}
          />
          <button
            className="bg-(--color) text-(--background-color) rounded p-1 px-4 text-sm cursor-pointer"
            onClick={() => setUsername(name.trim())}
          >
            Wrap
          </button>
        </div>
        <button onClick={() => {
          const newTheme = theme === "light" ? "dark" : "light";
          setTheme(newTheme);
          document.body.setAttribute("data-theme", newTheme);
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
	<path fill="currentColor" d="M7.5 2c-1.79 1.15-3 3.18-3 5.5s1.21 4.35 3.03 5.5C4.46 13 2 10.54 2 7.5A5.5 5.5 0 0 1 7.5 2m11.57 1.5l1.43 1.43L4.93 20.5L3.5 19.07zm-6.18 2.43L11.41 5L9.97 6l.42-1.7L9 3.24l1.75-.12l.58-1.65L12 3.1l1.73.03l-1.35 1.13zm-3.3 3.61l-1.16-.73l-1.12.78l.34-1.32l-1.09-.83l1.36-.09l.45-1.29l.51 1.27l1.36.03l-1.05.87zM19 13.5a5.5 5.5 0 0 1-5.5 5.5c-1.22 0-2.35-.4-3.26-1.07l7.69-7.69c.67.91 1.07 2.04 1.07 3.26m-4.4 6.58l2.77-1.15l-.24 3.35zm4.33-2.7l1.15-2.77l2.2 2.54zm1.15-4.96l-1.14-2.78l3.34.24zM9.63 18.93l2.77 1.15l-2.53 2.19z"></path>
</svg>
        </button>
      </div>

      {validUser === true && <Stats username={username} year={year} theme={theme} />}
      {validUser === false && <p>User not found.</p>}
    </main>
  );
}
