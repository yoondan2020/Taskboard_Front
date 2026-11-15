type InputProps = {
    label?: string;
    value?: string;
    type?: string;
    placeholder?: string;
    onChange?: (value: string) => void;
};

export default function Input({
    label,
    value,
    placeholder,
    type = "text",
    onChange,
}: InputProps) {
    return (
        <label className="w-full flex flex-col gap-1.5">
            <div className="field-label">{label}</div>
            <input
                type={type}
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange?.(e.target.value)}
                className="field-control"
            />
        </label>
    );
}