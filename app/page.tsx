import LandingPage from "../components/LandingPage";


export default function App(): React.ReactElement {
  return (
    <main className="relative bg-(--background-color) min-h-screen w-screen flex flex-col gap-8">
      <LandingPage />
    </main>
  );
}
