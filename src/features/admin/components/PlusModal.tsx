import { useState } from "react";
import "./PlusModal.css";

type Props = {
    onClose: () => void;
    onSubmit: (name: string) => void;
    buttonLabel: string;
};

export function PlusModal({ onClose, onSubmit, buttonLabel }: Props) {
    const [name, setName] = useState("");

    return (
        <div className="plus-modal-container">
            <div className="plus-modal-wrapper">
                <h2 className="plus-modal-header">
                    새로운 {buttonLabel} 추가
                </h2>

                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={`${buttonLabel} 이름`}
                    className="plus-modal-input"
                />

                <div className="plus-modal-button-wrapper">
                    <button
                        onClick={onClose}
                        className="plus-modal-cancel-button"
                    >
                        취소
                    </button>
                    <button
                        onClick={() => onSubmit(name)}
                        className="plus-modal-submit-button"
                        disabled={!name.trim()}
                    >
                        저장
                    </button>
                </div>
            </div>
        </div>
    );
}
