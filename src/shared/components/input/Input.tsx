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
        <label className="w-full flex text-md items-center gap-3 h-8">
            <div className="w-1/3">{label}</div>
            <input
                type={type}
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange?.(e.target.value)}
                className="w-2/3 p-1 border border-black rounded-lg h-full"
            />
        </label>
    );
}