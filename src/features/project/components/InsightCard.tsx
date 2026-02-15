import RightIcon from "@/shared/components/icons/RightIcon"
import { log } from "@/shared/lib/log"

type ColorType = 'black' | 'red' | 'blue';

type props = {
    label: string,
    value: number,
    color: ColorType,
}


export default function InsightCard({ label, value, color }: props) {
    log("[InsightCard] label, value :", label, value)

    const colorClasses: Record<ColorType, string> = {
        black: 'text-black',
        red: 'text-red-500',
        blue: 'text-blue-500',
    };

    return (
        <div className="w-full border rounded-xl p-3 flex justify-between items-center bg-white">
            <div className="flex gap-2 items-center">
                {label}
                <RightIcon />
            </div>
            <div className={`font-bold ${colorClasses[color]}`}>
                {value}
            </div>
        </div>
    )
}