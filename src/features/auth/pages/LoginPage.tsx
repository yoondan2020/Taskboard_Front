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
        <div className="min-h-screen w-full bg-white min-w-[1024px]">
            <div className="min-h-screen flex">
                {/* Left panel */}
                <div className="w-1/2 bg-gray-800 rounded-none flex flex-col items-center justify-center text-white">
                    <div className="w-full max-w-sm px-6 space-y-3 text-sm leading-relaxed text-gray-400 [&>div]:rounded-2xl [&>div]:bg-white/5 [&>div]:px-5 [&>div]:py-4 [&>div]:ring-1 [&>div]:ring-white/10 [&_span]:text-white [&_span]:font-semibold">
                        <div>
                            <p> <span className="font-bold"> 관리자</span> ID/PW </p>
                            <p>admin@example.com </p>
                            <p>admin1234 </p>
                        </div>
                        <div>
                            <p> <span className="font-bold">김철수</span> ID/PW</p>
                            <p>kim@example.com</p>
                            <p>user1234</p>
                        </div>
                        <div>
                            <p> <span className="font-bold">이영희</span> ID/PW</p>
                            <p>lee@example.com</p>
                            <p>user1234</p>
                        </div>
                        <div>
                            <p> <span className="font-bold">박민수</span> ID/PW</p>
                            <p>park@example.com</p>
                            <p>user1234</p>
                        </div>
                        <div>
                            <p> <span className="font-bold">최지우</span> ID/PW</p>
                            <p>choi@example.com</p>
                            <p>user1234</p>
                        </div>
                    </div>
                </div>

                {/* Right panel */}
                <div className="w-1/2 flex items-center justify-center px-12">
                    <div className="w-full max-w-[380px]">
                        {/* Title */}
                        <div className="mb-12 text-center">
                            <h1 className="text-5xl font-semibold text-gray-900">TaskBoard</h1>
                            <p className="mt-3 text-[17px] text-gray-500">프로젝트 관리 시스템</p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="이메일을 입력하세요."
                                className="field-control h-12"
                                autoComplete="email"
                            />

                            <input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="비밀번호를 입력하세요."
                                type="password"
                                className="field-control h-12"
                                autoComplete="current-password"
                            />

                            {error ? (
                                <p className="px-1 text-sm text-danger">{error}</p>
                            ) : null}

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary mt-3 h-12 w-full text-[17px]"
                            >
                                {loading ? "로그인 중..." : "로그인"}
                            </button>

                            <div className="pt-4 flex items-center justify-between text-sm">
                                <label className="flex items-center gap-2 text-gray-700 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={remember}
                                        onChange={(e) => setRemember(e.target.checked)}
                                        className="h-4 w-4 accent-primary"
                                    />
                                    <span>자동으로 로그인</span>
                                </label>

                                <button
                                    type="button"
                                    onClick={onFindPassword}
                                    className="text-primary hover:underline underline-offset-4 cursor-pointer"
                                >
                                    비밀번호 찾기
                                </button>
                            </div>
                        </form>

                        <div className="mt-10 md:hidden">
                            <div className="h-3 w-full rounded-full bg-primary" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
