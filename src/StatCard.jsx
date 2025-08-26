export default function StatCard({
  title,
  value,
  subtitle,
  prevValue,
  prevSubtitle,
  growth,
}) {
  if (growth === "ignore") {
    growth = "";
  } else {
    growth = `${growth > 0 ? "↑" : "↓"} ${Math.abs(growth)}%`;
  }

  return (
    <div className=" flex flex-col rounded border border-(--border)">
      <div className="flex flex-col gap-4 p-4">
        <h2 className="text-sm text-(--sub-text)">{title}</h2>
        <div className="flex flex-wrap gap-2 items-baseline">
          <p className="text-(--color) font-bold">{value ? value : "..."}</p>
          {subtitle && <p className="text-sm text-(--sub-text)">{subtitle}</p>}
        </div>
      </div>
      {prevValue !== undefined && (
        <div className="flex p-2 px-4 justify-between border-t border-(--border) pt-2">
          <p className="text-sm text-(--sub-text)">
            {prevValue}
            {prevSubtitle && (
              <span className="text-sm text-(--sub-text)">
                - ({prevSubtitle})
              </span>
            )}
          </p>
          <p className="text-sm text-(--sub-text)">{growth}</p>
        </div>
      )}
    </div>
  );
}
