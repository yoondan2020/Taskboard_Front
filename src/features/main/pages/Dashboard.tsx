import ProjectCard from "@/features/project/components/ProjectCard";
import ProjectUpdateModal from "@/features/project/components/ProjectUpdateModal";
import { useProjectStore } from "@/features/project/store/project.store";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { SummaryProjectDTO } from "@/shared/types/project.types";
import ContextMenu from "@/features/project/components/ContextMenu";
import { useMemo } from "react";
import { useUserStore } from "@/features/user/store/user.store";
import "./Dashboard.css"

export default function Dashboard() {
    const projectSummary = useProjectStore((s) => s.projectSummary); // raw 구독
    const filters = useProjectStore((s) => s.filters);        // 필터 구독
    const deleteProject = useProjectStore((s) => s.delete);
    const navigator = useNavigate();
    const me = useUserStore((s) => s.me);

    // 필터링(메모이제이션)
    const projects = useMemo(() => {
        const q = (filters.q ?? "").trim().toLowerCase();

        return projectSummary.filter((p) => {
            const matchQ =
                !q || (p.title ?? "").toLowerCase().includes(q);

            const matchGroup =
                !filters.productGroupId || p.product_group_id === filters.productGroupId;

            const matchState =
                !filters.stateId || p.state_id === filters.stateId;

            const matchOwner =
                !filters.onwerId || p.owner_id === filters.onwerId;

            return matchQ && matchGroup && matchState && matchOwner;
        });
    }, [projectSummary, filters.q, filters.productGroupId, filters.stateId, filters.onwerId]);

    // 컨텍스트 메뉴 상태
    const [contextMenu, setContextMenu] = useState<{
        x: number;
        y: number;
        projectId: number;
    } | null>(null);

    const [editingProject, setEditingProject] =
        useState<SummaryProjectDTO | null>(null);

    // 컨텍스트 메뉴 외부 클릭 + 자동 닫기
    useEffect(() => {
        const handleClick = () => setContextMenu(null);

        if (!contextMenu) return;

        document.addEventListener("click", handleClick);
        const timer = setTimeout(() => setContextMenu(null), 3000);

        return () => {
            document.removeEventListener("click", handleClick);
            clearTimeout(timer);
        };
    }, [contextMenu]);

    // 우클릭
    const handleContextMenu = (e: React.MouseEvent, projectId: number) => {
        e.preventDefault();
        e.stopPropagation();
        setContextMenu({
            x: e.clientX,
            y: e.clientY,
            projectId,
        });
    };

    // 수정
    const handleEdit = (projectId: number) => {
        setContextMenu(null);
        const project = projects.find((p) => p.id === projectId);
        if (project) {
            setEditingProject(project);
        }
    };

    // 삭제
    const confirmDeleteProject = () => {
        return window.confirm("정말로 이 프로젝트를 삭제하시겠습니까?");
    };

    const handleDelete = async (projectId: number) => {
        setContextMenu(null);

        if (!confirmDeleteProject()) return;

        await deleteProject(projectId);
    };

    // 수정 권한 체크
    const isEditable = (project: SummaryProjectDTO): boolean => {
        if (!me) return false;

        return (
            me.role === "ADMIN" ||
            me.role === "LAB_HEAD" ||
            (project.owner_id != null && me.id === project.owner_id)
        );
    };

    // 렌더링: 프로젝트가 없을 때
    if (projects.length < 1) {
        return (
            <div className="flex items-center justify-center min-h-[400px] text-gray-500">
                프로젝트가 없습니다.
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-col gap-4 h-full overflow-y-auto custom-scrollbar">
                {projects.map((project) => (
                    <div key={project.id}>
                        <div
                            onClick={() => navigator(`/project/${project.id}`)}
                            onContextMenu={(e) => handleContextMenu(e, project.id)}
                            className="cursor-pointer px-3"
                        >
                            <ProjectCard project={project} />
                        </div>
                    </div>
                ))}
            </div>

            {/* 컨텍스트 메뉴 */}
            {contextMenu && (
                <ContextMenu
                    contextMenu={contextMenu}
                    isEditable={isEditable(projects.find((p) => p.id === contextMenu.projectId)!)}
                    onEdit={() => {
                        handleEdit(contextMenu.projectId);
                    }}
                    onDelete={() => {
                        handleDelete(contextMenu.projectId);
                    }}
                    onClose={() => setContextMenu(null)}
                />
            )}

            {/* 수정 모달 */}
            {editingProject && (
                <ProjectUpdateModal
                    open={!!editingProject}
                    id={editingProject.id}
                    onClose={() => setEditingProject(null)}
                />
            )}
        </>
    );
}
