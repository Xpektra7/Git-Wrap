import { useEffect, useState } from "react";
import Stats from "./Stats";

export default function App() {
  const username = "Xpektra7";
  const year = 2025
  

  return (
    <main className="min-h-screen bg-neutral-900 text-white p-4 px-8 md:px-16 flex flex-col gap-8">
      <h1 className="text-2xl">{username} 2025</h1>
      <Stats username={username} year={year} />
    </main>
  );
}
