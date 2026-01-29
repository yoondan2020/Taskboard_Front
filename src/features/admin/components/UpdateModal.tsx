import { useState } from "react";
import "./UpdateModal.css";

type Props = {
    onClose: () => void;
    onSubmit: (name: string) => void;
    itemName?: string;
    buttonLabel: string;
};

export function UpdateModal({ onClose, onSubmit, itemName, buttonLabel }: Props) {
    const [name, setName] = useState("");

    return (
        <div className="update-modal-container">
            <div className="update-modal-wrapper">
                <h2 className="update-modal-header">
                    {buttonLabel} 수정
                </h2>

                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={`${itemName}`}
                    className="update-modal-input"
                />

                <div className="update-modal-button-wrapper">
                    <button
                        onClick={onClose}
                        className="update-modal-cancel-button"
                    >
                        취소
                    </button>
                    <button
                        onClick={() => onSubmit(name)}
                        className="update-modal-submit-button"
                        disabled={!name.trim()}
                    >
                        저장
                    </button>
                </div>
            </div>
        </div>
    );
}
