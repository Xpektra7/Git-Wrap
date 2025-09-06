export default function SocialCard({
  title,
  value,
  subtitle,
}) {

  return (
    <div className="flex absolute z-[-10] flex-col w-[400px] h-[100px] gap-4 p-4 rounded border border-(--border)">
        <h2 className="text-sm text-(--sub-text)">{title}</h2>
        <div className="flex flex-wrap gap-2 items-baseline">
          <p className="text-(--color) font-bold">
            {value && value !== 0 ? value : "0"}
          </p>
          {subtitle && <p className="text-sm text-(--sub-text)">{subtitle}</p>}
        </div>
    </div>);
}
