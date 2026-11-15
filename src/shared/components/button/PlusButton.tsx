import { PlusFile } from "../icons/PlusFile"

type Props = {
    buttonLabel: string;
    onClick: () => void;
};

export default function PlusButton({ buttonLabel, onClick }: Props) {
    return (
        <button
            onClick={onClick}
            className="btn-primary w-full h-9">
            <PlusFile /> 새로운 {buttonLabel} 추가
        </button>
    )
}