import logo from "@/assets/images/logo/logo.png";
import { useNavigate } from "react-router-dom";

export default function AdminHeader() {
    const navigator = useNavigate();
    return (
        <div className="
            flex w-full content-center items-center justify-between px-3 py-5 mb-5 
            border-b-[0.5px] border-b-[#005D73]/50
            ">
            <div />
            <div className="
            //border border-gray-300
            ">
                <img src={logo} width={80} alt="KOAS 로고" onClick={() => navigator("/dashboard")} />
            </div>
            <div />
        </div>
    );
}
