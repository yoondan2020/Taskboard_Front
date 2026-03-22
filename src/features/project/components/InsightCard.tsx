//app/features/project/components
type ColorType = 'black' | 'red' | 'blue';

type props = {
    label: string,
    value: number,
    color: ColorType,
}

export default function InsightCard({ label, value, color }: props) {

    const colorClasses: Record<ColorType, string> = {
        black: 'text-black',
        red: 'text-red-500',
        blue: 'text-blue-500',
    };

    return (
        <div className="w-full border rounded-xl p-3 flex flex-col justify-between items-center bg-white whitespace-nowrap">
            <div className="flex gap-2 items-center">
                {label}
            </div>
            <div className={`font-bold ${colorClasses[color]}`}>
                {value}
            </div>
        </div>
    )
}