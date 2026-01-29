type TextareaProps = {
    label: string;
    value: string;
    rows?: number;
    placeholder?: string;
    onChange: (value: string) => void;
};


export default function Textarea({
    label,
    value,
    rows = 4,
    placeholder,
    onChange,
}: TextareaProps) {
    return (
        <label className="w-full flex flex-col items-start">
            <div className="block mb-1">{label}</div>
            <textarea
                rows={rows}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full border rounded-md px-3 py-2 h-16"
                placeholder={placeholder}
            />
        </label>
    );
}