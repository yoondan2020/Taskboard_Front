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
        <div className="surface-card w-full h-full px-3 py-2.5 flex flex-col items-start gap-1 whitespace-nowrap hover:bg-gray-50 transition">
            <div className="flex gap-2 items-center text-xs font-medium text-gray-600">
                {label}
            </div>
            <div className={`text-2xl font-bold leading-tight ${colorClasses[color]}`}>
                {value}
            </div>
        </div>
    )
}