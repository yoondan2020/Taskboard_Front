type ActiveButtonProps = {
    active: boolean;
    onChange: (next: boolean) => void;
};

export default function ActiveButton({ active, onChange }: ActiveButtonProps) {
    return (
        <input
            type="checkbox"
            checked={active}
            onChange={(e) => onChange(e.target.checked)}
            className="
                relative
                h-6 w-12
                cursor-pointer
                appearance-none
                rounded-full
                bg-slate-500/40
                transition-all duration-300 ease-in-out
                checked:bg-green-500

                before:content-['']
                before:absolute
                before:top-0
                before:left-[-0.1rem]
                before:h-[1.55rem]
                before:w-[1.55rem]
                before:rounded-full
                before:border
                before:border-slate-500/50
                before:bg-white
                before:transition-all

                checked:before:translate-x-full
                checked:before:border-green-500
            "
        />
    );
}