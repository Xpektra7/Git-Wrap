export default function StatCard({ title, value, subtitle }){
    return(
        <div className=" flex flex-col p-4 gap-4 rounded border border-(--border)">
            <h2 className="text-sm text-(--sub-text)">{title}</h2>
            <div className="flex flex-wrap gap-2 items-baseline">
                <p className="text-(--color) font-bold">{value ? value : "0"}</p>
                {subtitle && <p className="text-sm text-(--sub-text)">{subtitle}</p>}
            </div>
        </div>
    )
}