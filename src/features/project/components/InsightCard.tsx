//app/features/project/components
type ColorType = 'black' | 'red' | 'blue';

type props = {
    label: string,
    value: number,
    color: ColorType,
}

export default function InsightCard({ label, value, color }: props) {

    const colorClasses: Record<ColorType, string> = {
        black: 'text-gray-900',
        red: 'text-danger',
        blue: 'text-primary',
    };

    return (
        <div className="surface-card w-full h-full p-4 flex flex-col items-start gap-2 whitespace-nowrap hover:border-black/10 transition">
            <div className="flex gap-2 items-center text-[13px] text-gray-500">
                {label}
            </div>
            <div className={`text-[28px] font-semibold leading-none tracking-tight ${colorClasses[color]}`}>
                {value}
            </div>
        </div>
    )
}