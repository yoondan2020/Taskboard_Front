import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/auth.store";

type Props = {
    onSubmit?: (payload: { email: string; password: string; remember: boolean }) => void;
    onFindPassword?: () => void;
};

export default function LoginPage({ onFindPassword }: Props) {
    // 로그인 상태 관리
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(true);

    const navigate = useNavigate();

    const login = useAuthStore((s) => s.login);
    const loading = useAuthStore((s) => s.loading);
    const error = useAuthStore((s) => s.error);

    // 폼 제출 핸들러
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login({ email, password, remember });
            navigate("/dashboard");
        } catch {
        }
    };

    return (
        <div className="min-h-screen w-full bg-white">
            <div className="min-h-screen flex">
                {/* Left panel */}
                <div className="w-1/2 bg-primary rounded-r-2xl flex flex-col items-end justify-center text-white">
                    <div className="space-y-5 text-end px-10">
                        <div>
                            <p> <span className="font-bold"> 관리자</span> ID/PW </p>
                            <p>admin@lab.com </p>
                            <p>admin1234 </p>
                        </div>
                        <div>
                            <p> <span className="font-bold">LAB_HEAD </span> ID/PW</p>
                            <p>head@lab.com</p>
                            <p>head1234</p>
                        </div>
                        <div>
                            <p> <span className="font-bold">Member1</span> ID/PW</p>
                            <p>member1@lab.com</p>
                            <p>member1234</p>
                        </div>
                        <div>
                            <p> <span className="font-bold">Member2</span> ID/PW</p>
                            <p>member2@lab.com</p>
                            <p>member1234</p>
                        </div>
                        <div>
                            <p> <span className="font-bold">Member3</span> ID/PW</p>
                            <p>member3@lab.com</p>
                            <p>member1234</p>
                        </div>
                    </div>
                </div>

                {/* Right panel */}
                <div className="w-1/2 flex items-center justify-center px-40">
                    <div className="w-full">
                        {/* Title */}
                        <div className="mb-14 text-center">
                            <h1 className="text-5xl font-extrabold tracking-wide text-black">TaskBoard</h1>
                            <p className="mt-2 text-sm text-gray-500">프로젝트 관리 시스템</p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="이메일을 입력하세요."
                                className="h-11 w-full rounded-md border-gray-400 px-4 text-sm outline-none placeholder:text-gray-400 focus:border-primary"
                                autoComplete="email"
                            />

                            <input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="비밀번호를 입력하세요."
                                type="password"
                                className="h-11 w-full rounded-md border-gray-400 px-4 text-sm outline-none placeholder:text-gray-400 focus:border-primary"
                                autoComplete="current-password"
                            />

                            {error ? (
                                <p className="text-sm text-red-600">{error}</p>
                            ) : null}

                            <button
                                type="submit"
                                disabled={loading}
                                className="
                                    mt-2 h-11 w-full rounded-full border border-primary bg-white text-sm font-semibold 
                                    text-primary transition hover:bg-primary hover:text-white active:scale-[0.99] disabled:opacity-60
                                "
                            >
                                {loading ? "로그인 중..." : "로그인"}
                            </button>

                            <div className="mt-6 flex items-center justify-between text-sm">
                                <label className="flex items-center gap-2 text-gray-600">
                                    <input
                                        type="checkbox"
                                        checked={remember}
                                        onChange={(e) => setRemember(e.target.checked)}
                                        className="h-4 w-4 accent-[#0F6A62]"
                                    />
                                    <span className="underline underline-offset-4">자동으로 로그인</span>
                                </label>

                                <button
                                    type="button"
                                    onClick={onFindPassword}
                                    className="text-gray-600 underline underline-offset-4 hover:text-gray-800"
                                >
                                    비밀번호 찾기
                                </button>
                            </div>
                        </form>

                        <div className="mt-10 md:hidden">
                            <div className="h-3 w-full rounded-full bg-[#0F6A62]" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
