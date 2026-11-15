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

export default function HistroySelect({
    label,
    items,
    value,
    onChange,
}: SelectProps) {
    return (
        <label className="w-full flex items-center gap-3">
            <div className="field-label whitespace-nowrap">{label}</div>

            <select
                className="field-control select-chevron h-10"
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
