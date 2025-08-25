export default function UserNotFound() {
  return (
    <div className="flex h-[80vh] flex-col items-center justify-center gap-4">
      <img src="./user_not_found.svg" alt="User not Found" className="w-[50vw] max-w-100" />
      <p className="text-xl">User not found.</p>
    </div>
  );
}
