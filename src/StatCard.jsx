export default function StatCard({ title, value }){
    return(
        <div className=" flex flex-col p-4 gap-4 rounded border border-neutral-800">
            <h2 className="text-sm text-neutral-300">{title}</h2>
            <p className="text-white font-bold">{value ? value : "..."}</p>
        </div>
    )
}