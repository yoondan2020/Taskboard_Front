type SelectItem = {
    value: string | number;
    label: string;
};

type SelectProps = {
    label: string;
    items: SelectItem[];
    value: string | number;
    onChange: (value: string) => void;
};

export default function Select({
    label,
    items,
    value,
    onChange,
}: SelectProps) {
    return (
        <label className="w-full flex text-md items-center gap-2 h-8">
            <div className="w-1/3 whitespace-nowrap">{label}</div>

            <select
                className="w-2/3 border border-black rounded-lg p-1 h-full"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            >
                <option value="">선택</option>

                {
                    items.map((item) => (
                        <option key={item.value} value={String(item.value)}>
                            {item.label}
                        </option>
                    ))
                }
            </select >
        </label >
    );
}
