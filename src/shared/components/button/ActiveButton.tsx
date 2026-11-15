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
                bg-gray-300
                transition-all duration-300 ease-in-out
                checked:bg-primary

                before:content-['']
                before:absolute
                before:top-0
                before:left-[-0.1rem]
                before:h-[1.55rem]
                before:w-[1.55rem]
                before:rounded-full
                before:border
                before:border-gray-300
                before:bg-white
                before:transition-all

                checked:before:translate-x-full
                checked:before:border-primary
            "
        />
    );
}