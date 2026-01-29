import RightIcon from "@/shared/components/icons/RightIcon"

type props = {
    label: string,
    value: number,
}

export default function InsightCard({ label, value }: props) {
    return (
        <div className="w-full border rounded-xl p-3 flex justify-between items-center bg-white">
            <div className="flex gap-2 items-center">
                {label}
                <RightIcon />
            </div>
            <div className="font-bold">
                {value}
            </div>
        </div>
    )
}