import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useProjectStore } from "@/features/project/store/project.store";
import PlusButton from "@/shared/components/button/PlusButton";
import ModifyIcon from "@/shared/components/icons/ModifyIcon";
import { useStateStore } from "@/features/admin/store/state.store";
import { useStageStore } from "@/features/admin/store/stage.store";
import { useProjectStageStore } from "@/features/project/store/projectStage.store";
import { useUserStore } from "@/features/user/store/user.store";
import React from "react";
import StageCreateModal from "@/features/project/components/StageCreateModal";
import ContextMenu from "@/features/project/components/ContextMenu";
import StageUpdateFrom from "@/features/project/components/StageUpdateForm";
import type { StageFromData } from "@/shared/types/stageFromData.types";
import type { CreateProjectStage, DetailProjectStage } from "@/shared/types/projectStage.types";

export default function ProjectDetailPage() {
    const { id } = useParams();
    const projectId = Number(id);

    // 프로젝트
    const project = useProjectStore((s) => s.projectDetail);
    const loading = useProjectStore((s) => s.loading);
    const error = useProjectStore((s) => s.error);
    const fetchDetail = useProjectStore((s) => s.fetchDetail);

    // user
    const fetchUser = useUserStore((s) => s.fetchActive);
    const users = useUserStore((s) => s.items);
    const me = useUserStore((s) => s.me);

    // Stage & State
    const fetchState = useStateStore((s) => s.fetchActive);
    const fetchStage = useStageStore((s) => s.fetchActive);
    const states = useStateStore((s) => s.items);
    const updateStage = useProjectStageStore((s) => s.update);
    const deleteStage = useProjectStageStore((s) => s.delete);
    const create = useProjectStageStore((s) => s.create);


    // Create Stage
    const [isStageModalOpen, setIsStageModalOpen] = useState(false);

    useEffect(() => {
        if (id) {
            fetchDetail(Number(id));
            fetchStage();
            fetchState();
            fetchUser();
        }
    }, [id, fetchDetail]);

    const [expandedStageId, setExpandedStageId] = useState<number | null>(null);
    const [stageSortOrder, setStageSortOrder] = useState<"asc" | "desc">("asc");

    //우클릭 메뉴
    const [contextMenu, setContextMenu] = useState<{
        x: number;
        y: number;
        stageId: number;
    } | null>(null);

    if (loading) return <p className="rounded-lg bg-callout-gray p-12 text-center text-sm text-gray-500">Loading...</p>;
    if (error) return <p className="rounded-lg bg-callout-red p-12 text-center text-sm text-danger">Error: {error}</p>;
    if (!project) return <p className="rounded-lg bg-callout-gray p-12 text-center text-sm text-gray-500">Project not found</p>;

    const sortedStages = [...project.stages].sort((a, b) => {
        const aValue = a.sequence ?? 0;
        const bValue = b.sequence ?? 0;
        return stageSortOrder === "asc" ? aValue - bValue : bValue - aValue;
    });

    // state_name → { label, color } 반환
    const getStateInfo = (state_name?: string) => {
        switch (state_name) {
            case "PLANNED":
                return { label: "PLANNED", color: "status-planned" };
            case "IN_PROGRESS":
                return { label: "IN_PROGRESS", color: "status-inProgress" };
            case "DELAYED":
                return { label: "DELAYED", color: "status-delayed" };
            case "DONE":
                return { label: "DONE", color: "status-completed" };
            default:
                return { label: "-", color: "status-planned" };
        }
    };

    // 단계 수정 폼 토글
    const handleToggleEdit = (stageId: number) => {
        setExpandedStageId(expandedStageId === stageId ? null : stageId);
    };

    // State
    const stateItems = states.map((item) => ({
        value: item.id,
        label: item.name,
    }));

    // user
    const userItems = users.map((user) => ({
        value: user.id,
        label: `${user.name} (${user.position})`,
    }));

    // 우클릭 핸들러 => contextMenu 위치
    const handleContextMenu = (
        e: React.MouseEvent,
        stageId: number
    ) => {
        e.preventDefault();

        setContextMenu({
            x: e.clientX,
            y: e.clientY,
            stageId,
        });
    };

    // 단계 수정 폼 데이터 정규화
    const normalizeFormData = (formData: StageFromData) => ({
        name: formData.name || undefined,
        state_id: formData.state_id ? Number(formData.state_id) : undefined,
        due_date: formData.due_date || undefined,
        eta: formData.eta || undefined,
        completed_date: formData.completed_date || undefined,
        note: formData.note === "" ? "" : (formData.note || undefined),
        remark: formData.remark === "" ? "" : (formData.remark || undefined),
        change_reason: formData.change_reason || undefined,
    });

    // 단계 생성 폼 데이터 정규화
    const createNormalizeFormData = (formData: StageFromData): CreateProjectStage => {
        return {
            name: formData.name,
            state_id: formData.state_id === "" ? undefined : Number(formData.state_id),

            due_date: formData.due_date || undefined,
            eta: formData.eta || undefined,
            completed_date: formData.completed_date || undefined,

            stage_owner_id: formData.stage_owner_id === "" ? undefined : Number(formData.stage_owner_id),

            note: formData.note || undefined,
            remark: formData.remark || undefined,
        };
    };

    //오름차순 내림차순
    const toggleStageSortOrder = () => {
        setStageSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    };

    // 수정 권한
    const isEditable = (stage: DetailProjectStage): boolean => {
        if (!me) return false;

        return (
            me.role === "ADMIN" ||
            (stage.stage_owner_id != null && me.id === stage.stage_owner_id) ||
            (project.owner_id != null && me.id == project.owner_id)
        );
    };

    return (
        <div
            className="min-h-screen"
            onClick={() => setContextMenu(null)}
        >
            {/* Main Content */}
            <div className="">
                <div className="flex justify-end items-center gap-2">
                    {/* 정렬 */}
                    <button
                        type="button"
                        onClick={toggleStageSortOrder}
                        className="btn-secondary h-9"
                    >
                        <span className="font-semibold">{stageSortOrder === "asc" ? "오름차순" : "내림차순"}</span>
                        <span className="text-[10px] text-gray-400">{stageSortOrder === "asc" ? "▲" : "▼"}</span>
                    </button>
                    <div className="">
                        < PlusButton
                            buttonLabel={"단계"}
                            onClick={() => { setIsStageModalOpen(true) }} />
                    </div>
                </div>
                {isStageModalOpen && (
                    <StageCreateModal
                        isOpen={isStageModalOpen}
                        onClose={() => setIsStageModalOpen(false)}
                        onSave={(data) => {
                            const payload = createNormalizeFormData(data);
                            if (!payload) {
                                return;
                            }
                            create(projectId, payload);
                        }}
                        stateItems={stateItems}
                        userItems={userItems}
                    />
                )}

                <div className="flex flex-col py-5">
                    <div className="flex gap-8 items-start">
                        {/* Left Sidebar */}
                        <div className={`w-[340px] shrink-0 h-fit surface-card overflow-hidden`} >
                            <div className={`h-1 status-solid ${getStateInfo(project.state_name).color}`}></div>
                            <div className="space-y-5 p-5 h-fit">
                                {/* Thumbnail */}
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <span className={`status-badge ${getStateInfo(project.state_name).color}`}>{getStateInfo(project.state_name).label}</span>
                                        <div className="text-[26px] font-bold leading-tight break-keep text-gray-900">{project.title}</div>
                                    </div>
                                    <div className="bg-callout-gray aspect-[4/3] rounded-md overflow-hidden">
                                        {project.thumbnail_url ? (
                                            <img
                                                src={project.thumbnail_url}
                                                alt={project.title}
                                                className="w-full h-full object-contain"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-callout-gray" />
                                        )}
                                    </div>
                                </div>

                                {/* Project Info */}
                                <div className="border-y border-gray-200 py-2">
                                    <table className="w-full table-fixed border-collapse text-left text-sm">
                                        <tbody>
                                            <tr>
                                                <th className="w-20 py-1.5 font-normal text-gray-500 align-top">구분 :</th>
                                                <td className="py-1.5 text-gray-900 break-keep">{project.product_group_name}</td>
                                            </tr>
                                            <tr>
                                                <th className="w-20 py-1.5 font-normal text-gray-500 align-top">목표일 :</th>
                                                <td className="py-1.5 text-gray-900 break-keep">{project.goal_due_date}</td>
                                            </tr>
                                            <tr>
                                                <th className="w-20 py-1.5 font-normal text-gray-500 align-top">담당자 :</th>
                                                <td className="py-1.5 text-gray-900 break-keep">{project.owner_name}</td>
                                            </tr>
                                            <tr>
                                                <th className="w-20 py-1.5 font-normal text-gray-500 align-top">유관자 :</th>
                                                <td className="py-1.5 text-gray-900 break-keep">{project.stage_owner_names.join(", ")}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                {/* Progress */}
                                <div className="">
                                    <div className="flex items-baseline justify-between mb-2">
                                        <div className="text-sm font-semibold text-gray-700">진행률</div>
                                    </div>
                                    <div className="relative w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className="absolute h-full bg-primary rounded-full"
                                            style={{
                                                width: `${(project.progress.completed / project.progress.total) * 100}%`
                                            }}
                                        ></div>
                                    </div>
                                    <p className="text-xs text-gray-600 mt-1.5 tabular-nums">
                                        {project.progress.completed}/{project.progress.total} 단계 {project.progress.total > 0 ? Math.round((project.progress.completed / project.progress.total) * 100) : 0}%
                                    </p>
                                </div>

                                {/* Note or Remark */}
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-700 mb-2">비고</h3>
                                    <p className="text-sm leading-relaxed text-gray-800 whitespace-pre-wrap rounded-md bg-callout-yellow px-4 py-3">
                                        {project.remark || "-"}
                                    </p>
                                </div>
                            </div>
                        </div>
                        {/* Right Content - Stages Table */}
                        <div className="flex-1 min-w-0 space-y-5">

                            {/* Table */}
                            <div className="rounded-lg border border-gray-200 bg-white overflow-hidden whitespace-nowrap">
                                <table className="w-full table-auto items-center">
                                    {/* Table Header */}
                                    <thead>
                                        <tr className="border-b border-gray-200 bg-gray-100 [&>th]:border-r [&>th]:border-gray-200 [&>th:last-child]:border-r-0">
                                            <th className="text-center py-3 px-2 text-xs font-medium text-gray-600">
                                                <div className="flex items-center justify-center gap-2">
                                                    <span>Index</span>
                                                </div>
                                            </th>
                                            <th className="text-left py-3 px-2 text-xs font-medium text-gray-600">단계명</th>
                                            <th className="text-center py-3 px-4 text-xs font-medium text-gray-600">상태</th>
                                            <th className="text-center py-3 px-2 text-xs font-medium text-gray-600">마감일</th>
                                            <th className="text-center py-3 px-2 text-xs font-medium text-gray-600">예상 마감일</th>
                                            <th className="text-center py-3 px-2 text-xs font-medium text-gray-600">실제 완료일</th>
                                            <th className="text-center py-3 px-2 text-xs font-medium text-gray-600">담당자</th>
                                            <th className="text-center py-3 px-2 text-xs font-medium text-gray-600"></th>
                                        </tr>
                                    </thead>

                                    {/* Table Body */}
                                    {/* 조건부 렌더링 */}
                                    {project.stages.length < 1 ? (
                                        <tbody>
                                            <tr>
                                                <td
                                                    colSpan={8}
                                                    className="text-center py-20 text-sm text-gray-500"
                                                >
                                                    프로젝트 상세 단계가 존재하지 않습니다.
                                                </td>
                                            </tr>
                                        </tbody>
                                    ) : (
                                        <tbody>
                                            {sortedStages.map((stage, index) => {
                                                const displayIndex =
                                                    stageSortOrder === "asc" ? index + 1 : sortedStages.length - index;

                                                return (
                                                    <React.Fragment key={stage.id}>
                                                        <tr
                                                            style={{
                                                                borderBottom: (stage.note || stage.remark) ? "none" : undefined
                                                            }}
                                                            className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors [&>td]:border-r [&>td]:border-gray-200 [&>td:last-child]:border-r-0"
                                                            onContextMenu={(e) => handleContextMenu(e, stage.id)}
                                                        >
                                                            {/* 인덱스 */}
                                                            <td className="py-4 px-2">
                                                                <div className="flex justify-center">
                                                                    <div className="size-6 rounded-[4px] bg-tag-gray text-tag-gray-text flex items-center justify-center font-semibold text-xs tabular-nums">
                                                                        {displayIndex}
                                                                    </div>
                                                                </div>
                                                            </td>

                                                            {/* 상태 (단계명) */}
                                                            <td className="py-3 px-2 items-center">
                                                                <div className="text-sm font-semibold text-gray-900">{stage.name}</div>
                                                            </td>

                                                            {/* State Badge (상태) */}
                                                            <td className="py-4 px-2 flex items-center justify-center">
                                                                <div className={`text-center items-center justify-center`}>
                                                                    <div
                                                                        className={`status-badge ${getStateInfo(stage.state_name).color}`}
                                                                    >
                                                                        <div>
                                                                            {getStateInfo(stage.state_name).label}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>

                                                            {/* 마감일 */}
                                                            <td className="py-4 px-2 text-center text-sm text-gray-700 tabular-nums">
                                                                {stage.due_date || "-"}
                                                            </td>

                                                            {/* 예상 마감일 */}
                                                            <td className="py-4 px-2 text-center text-sm text-gray-700 tabular-nums">
                                                                {stage.eta || "-"}
                                                            </td>

                                                            {/* 실제 완료일 */}
                                                            <td className="py-4 px-2 text-center text-sm text-gray-700 tabular-nums">
                                                                {stage.completed_date || "-"}
                                                            </td>

                                                            {/* 담당자 */}
                                                            <td className="py-4 px-2">
                                                                <div className="flex items-center justify-center gap-2">
                                                                    <span className="text-sm">{stage.stage_owner_name ?? "-"}</span>
                                                                </div>
                                                            </td>
                                                            {/* 수정 버튼 */}
                                                            {isEditable(stage) && (
                                                                <td
                                                                    onClick={() => handleToggleEdit(stage.id)}
                                                                    className="cursor-pointer pr-4 text-gray-500"
                                                                >
                                                                    <ModifyIcon />
                                                                </td>
                                                            )
                                                            }
                                                        </tr>
                                                        {/* note / remark row */}
                                                        {(stage.note || stage.remark) && (
                                                            <tr className="border-b border-gray-200 last:border-b-0">
                                                                <td colSpan={8} className="py-3 pl-14 pr-6 whitespace-normal bg-gray-50">
                                                                    <div className="space-y-1.5 text-sm leading-relaxed">
                                                                        {stage.note && <p className="rounded-md bg-callout-blue px-3 py-2 text-gray-800">{stage.note}</p>}
                                                                        {stage.remark && <p className="rounded-md bg-callout-red px-3 py-2 text-tag-red-text">{stage.remark}</p>}
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )}

                                                        {/* 아코디언 수정 폼 */}
                                                        {expandedStageId === stage.id && (
                                                            <StageUpdateFrom
                                                                stage={stage}
                                                                stateItems={stateItems}
                                                                userItems={userItems}
                                                                onCancel={() => setExpandedStageId(null)}
                                                                onSave={(formData) => {
                                                                    updateStage(projectId, Number(stage.id), normalizeFormData(formData));
                                                                    setExpandedStageId(null);
                                                                }}
                                                            />
                                                        )}
                                                    </React.Fragment>
                                                )
                                            })}
                                        </tbody>
                                    )}
                                </table>
                            </div>
                            {contextMenu && (
                                < ContextMenu
                                    contextMenu={contextMenu}
                                    isEditable={isEditable(project.stages.find((s) => s.id === contextMenu.stageId)!)}
                                    onEdit={() => {
                                        handleToggleEdit(contextMenu.stageId);
                                    }}
                                    onDelete={() => {
                                        deleteStage(projectId, contextMenu.stageId);
                                    }}
                                    onClose={() => setContextMenu(null)}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}
