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
        <label className="w-full flex flex-col items-start gap-1.5">
            <div className="field-label">{label}</div>
            <textarea
                rows={rows}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="field-control h-auto min-h-[96px] py-3 resize-y leading-relaxed"
                placeholder={placeholder}
            />
        </label>
    );
}