import { PlusFile } from "../icons/PlusFile"

type Props = {
    buttonLabel: string;
    onClick: () => void;
};

export default function PlusButton({ buttonLabel, onClick }: Props) {
    return (
        <button
            onClick={onClick}
            className="w-full flex gap-1 bg-primary hover:bg-primary-dark text-white items-center text-center justify-center px-5 py-2 border border-black rounded-xl text-base cursor-pointer">
            <PlusFile /> 새로운 {buttonLabel} 추가
        </button>
    )
}