import logo from "@/assets/images/logo/logo.svg";
import { useNavigate } from "react-router-dom";

export default function AdminHeader() {
    const navigator = useNavigate();
    return (
        <div className="
            max-w-[1920px] mx-auto h-16 px-6 flex items-center justify-between
            ">
            <div />
            <div className="
            //border border-gray-300
            ">
                <img src={logo} width={80} alt="KOAS 로고" onClick={() => navigator("/dashboard")} className="h-8 w-auto cursor-pointer" />
            </div>
            <div />
        </div>
    );
}
