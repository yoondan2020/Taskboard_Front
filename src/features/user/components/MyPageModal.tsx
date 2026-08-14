// src/components/user/MyPageModal.tsx
import { useEffect, useMemo, useState } from "react";
import type { Me } from "@/shared/types/user.types";
import { useProjectStore } from "@/features/project/store/project.store";
import ProjectSummaryCard from "@/features/project/components/ProjectSummaryCard";
import SearchMyBox from "./SearchMyBox";
import { filterProjects } from "@/shared/hooks/filterProject";
import { useNavigate } from "react-router-dom";

type Props = {
    open: boolean;
    onClose: () => void;
    me: Me | null;
    logout: () => void;
};

type MenuKey = "profile" | "owned" | "related";

const MENU: { key: MenuKey; label: string; }[] = [
    { key: "profile", label: "내 정보" },
    { key: "owned", label: "담당 프로젝트" },
    { key: "related", label: "참여 프로젝트", },
];

export default function MyPageModal({
    open,
    onClose,
    me,
    logout,
}: Props) {
    const [active, setActive] = useState<MenuKey>("profile");
    const navigator = useNavigate();

    // 내가 owner인 프로젝트
    const fetchMyProjects = useProjectStore((s) => s.fetchMyProject);
    const myProjects = useProjectStore((s) => s.myProjects);

    // 내가 projectStageOwner인 프로젝트
    const fetchRelatedProject = useProjectStore((s) => s.fetchRelatedProject);
    const relatedProject = useProjectStore((s) => s.relatedProject)

    const title = useMemo(() => {
        const found = MENU.find((m) => m.key === active);
        return found?.label ?? "내 정보";
    }, [active]);

    // 필터링
    const filters = useProjectStore((s) => s.myPagefilters);
    const setFilters = useProjectStore((s) => s.setMyPageFilters);

    const filteredMyProjects = useMemo(() => {
        return filterProjects(myProjects, filters);
    }, [myProjects, filters.q, filters.productGroupId, filters.stateId]);

    const filteredRelatedProjects = useMemo(() => {
        return filterProjects(relatedProject, filters);
    }, [relatedProject, filters.q, filters.productGroupId, filters.stateId]);

    // 모달 닫혀있으면 렌더하지 않음
    useEffect(() => {
        if (!open) return;
        if (!me?.id) return;
        fetchMyProjects();
        fetchRelatedProject();
    }, [open, me?.id, fetchMyProjects]);

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            role="dialog"
            aria-modal="true"
            aria-label="마이페이지 모달"
            onMouseDown={(e) => {
                // 바깥 클릭 닫기
                if (e.target === e.currentTarget) onClose();
            }}
        >
            {/* overlay */}
            <div className="absolute inset-0 bg-black/40" />

            {/* modal */}
            <div className="relative w-[980px] max-w-[92vw] h-[640px] max-h-[86vh] bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* header */}
                <div className="h-14 px-5 flex items-center justify-between border-b">
                    <div className="flex items-center gap-3">
                        <div className="text-lg font-semibold">{title}</div>
                        {me?.name ? (
                            <div className="text-sm text-gray-500">
                                {me.name} · {me.email}
                            </div>
                        ) : (
                            <div className="text-sm text-gray-500">내 정보를 불러오는 중…</div>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        {/* {me?.role == "ADMIN" &&
                            <button
                                className="px-3 py-1.5 text-sm rounded-lg border bg-white hover:bg-gray-300 cursor-pointer"
                                onClick={() => navigator("/admin")}
                                type="button"
                            >
                                관리자 페이지로 이동
                            </button>
                        } */}
                        <button
                            className="px-3 py-1.5 text-sm rounded-lg bg-gray-900 text-white hover:bg-gray-800 cursor-pointer"
                            onClick={onClose}
                            type="button"
                        >
                            닫기
                        </button>
                    </div>
                </div>

                {/* body: left menu + right content */}
                <div className="h-[calc(100%-56px)] grid grid-cols-[260px_1fr]">
                    {/* left menu */}
                    <aside className="border-r bg-gray-50">
                        <div className="p-4">
                            <div className="rounded-2xl bg-white border p-4">
                                <div className="text-sm text-gray-500">로그인 계정</div>
                                <div className="mt-1 font-semibold">{me?.name ?? "—"}</div>
                                <div className="text-sm text-gray-600">{me?.email ?? "—"}</div>
                                <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                                    <span className="px-2 py-1 rounded-full bg-gray-100 border">
                                        {me?.role ?? "ROLE"}
                                    </span>
                                    <span className="px-2 py-1 rounded-full bg-gray-100 border">
                                        {me?.is_active === false ? "비활성" : "활성"}
                                    </span>
                                </div>
                            </div>

                            <nav className="mt-4 space-y-1">
                                {MENU.map((m) => {
                                    const isActive = m.key === active;
                                    return (
                                        <button
                                            key={m.key}
                                            type="button"
                                            onClick={() => {
                                                setActive(m.key);
                                                setFilters({ q: "", productGroupId: undefined, stateId: 2 });
                                            }}
                                            className={[
                                                "w-full text-left rounded-xl px-3 py-2 border transition",
                                                isActive
                                                    ? "bg-white border-gray-900 shadow-sm"
                                                    : "bg-transparent border-transparent hover:bg-white hover:border-gray-200",
                                            ].join(" ")}
                                        >
                                            <div className="font-medium">{m.label}</div>
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>
                    </aside>

                    {/* right content */}
                    <main className="p-6 overflow-auto">
                        {active === "profile" && (
                            <ProfilePanel me={me} logout={logout} />
                        )}

                        {active === "owned" && (
                            <div className="space-y-4">
                                <div className="text-lg font-semibold">담당 프로젝트</div>
                                {myProjects.length === 0 ? (
                                    <div className="text-center text-gray-500">담당 프로젝트가 아직 없어요.</div>
                                ) : (
                                    <div className="space-y-3">
                                        <div>
                                            <SearchMyBox />
                                        </div>
                                        <div className="cursor-pointer space-y-2">
                                            {filteredMyProjects.map(project =>
                                                <div onClick={() => navigator(`/project/${project.id}`)}>
                                                    < ProjectSummaryCard
                                                        key={project.id}
                                                        project={project}

                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {active === "related" && (
                            <div className="space-y-4">
                                <div className="text-lg font-semibold">참여 프로젝트</div>
                                {relatedProject.length === 0 ? (
                                    <div className="text-center text-gray-500">참여 중인 프로젝트가 아직 없어요.</div>
                                ) : (
                                    <div className="space-y-3">
                                        <div>
                                            <SearchMyBox />
                                        </div>
                                        <div className="cursor-pointer space-y-2">
                                            {filteredRelatedProjects.map(project =>
                                                <div onClick={() => navigator(`/project/${project.id}`)}>
                                                    < ProjectSummaryCard
                                                        key={project.id}
                                                        project={project}

                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}

function ProfilePanel({
    me,
    logout,
}: {
    me: Me | null;
    logout?: () => void;
}) {
    return (
        <section className="space-y-4">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <div className="text-xl font-semibold">내 정보</div>
                </div>

                <button
                    type="button"
                    className="px-4 py-1 rounded-full border hover:bg-gray-50 cursor-pointer"
                    onClick={logout}
                >
                    로그아웃
                </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <InfoCard label="이름" value={me?.name ?? "—"} />
                <InfoCard label="이메일" value={me?.email ?? "—"} />
                <InfoCard label="부서" value={me?.department ?? "—"} />
                <InfoCard label="직책" value={me?.position ?? "—"} />
                <InfoCard label="권한" value={me?.role ?? "—"} />
                <InfoCard label="상태" value={me?.is_active === false ? "비활성" : "활성"} />
            </div>
        </section>
    );
}

function InfoCard({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-2xl border p-4 bg-white">
            <div className="text-xs text-gray-500">{label}</div>
            <div className="mt-1 font-semibold break-all">{value}</div>
        </div>
    );
}
