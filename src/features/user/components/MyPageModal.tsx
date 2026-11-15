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
            <div className="modal-overlay" />

            {/* modal */}
            <div className="modal-panel w-[980px] max-w-[92vw] h-[640px] max-h-[86vh] overflow-hidden">
                {/* header */}
                <div className="h-16 px-6 flex items-center justify-between border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="modal-title">{title}</div>
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
                                className="px-3 py-1.5 text-sm rounded-lg border bg-gray-50 text-gray-700 hover:bg-gray-100 cursor-pointer"
                                onClick={() => navigator("/admin")}
                                type="button"
                            >
                                관리자 페이지로 이동
                            </button>
                        } */}
                        <button
                            className="btn-dark"
                            onClick={onClose}
                            type="button"
                        >
                            닫기
                        </button>
                    </div>
                </div>

                {/* body: left menu + right content */}
                <div className="h-[calc(100%-64px)] grid grid-cols-[260px_1fr]">
                    {/* left menu */}
                    <aside className="border-r border-gray-100 bg-gray-50">
                        <div className="p-4">
                            <div className="rounded-2xl bg-white ring-1 ring-black/5 p-4">
                                <div className="text-sm text-gray-500">로그인 계정</div>
                                <div className="mt-1 font-semibold">{me?.name ?? "—"}</div>
                                <div className="text-sm text-gray-600">{me?.email ?? "—"}</div>
                                <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                                    <span className="tag">
                                        {me?.role ?? "ROLE"}
                                    </span>
                                    <span className="tag">
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
                                                "w-full text-left rounded-xl px-3 py-2 text-[15px] transition cursor-pointer",
                                                isActive
                                                    ? "bg-white text-primary ring-1 ring-black/5"
                                                    : "text-gray-700 hover:bg-white",
                                            ].join(" ")}
                                        >
                                            <div className="font-semibold">{m.label}</div>
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
                                <div className="text-[17px] font-semibold tracking-tight">담당 프로젝트</div>
                                {myProjects.length === 0 ? (
                                    <div className="rounded-2xl bg-gray-50 p-12 text-center text-[15px] text-gray-500">담당 프로젝트가 아직 없어요.</div>
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
                                <div className="text-[17px] font-semibold tracking-tight">참여 프로젝트</div>
                                {relatedProject.length === 0 ? (
                                    <div className="rounded-2xl bg-gray-50 p-12 text-center text-[15px] text-gray-500">참여 중인 프로젝트가 아직 없어요.</div>
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
                    <div className="text-[21px] font-semibold tracking-tight">내 정보</div>
                </div>

                <button
                    type="button"
                    className="btn-secondary h-9 px-4"
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
        <div className="rounded-2xl bg-gray-50 p-4">
            <div className="text-xs text-gray-500">{label}</div>
            <div className="mt-1 text-[15px] font-semibold text-gray-900 break-all">{value}</div>
        </div>
    );
}
