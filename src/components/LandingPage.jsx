export default function LandingPage() {
  return (
    <div className="flex h-[80vh] flex-col items-center justify-center gap-4">
      <img
        src="./wrap.svg"
        alt="User not Found"
        className="w-[50vw] max-w-100"
      />
      <p className="text-xl">Enter a GitHub username and click "Wrap" to see your yearly stats.</p>
    </div>
  );
}
