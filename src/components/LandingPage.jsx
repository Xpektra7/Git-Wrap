export default function LandingPage() {
  return (
    <div className="flex flex-col md:flex-row h-[80vh] items-center justify-center gap-4">
      <img
        src="./logo.svg"
        alt="User not Found"
        className="w-[30vw] max-w-60 logo"
      />
      <p className="text-xl inline-flex items-center gap-3"><span className="w-[2px] h-6 rounded-full inline-block bg-(--sub-text)"></span>Enter a GitHub username to see your yearly stats.</p>
    </div>
  );
}
