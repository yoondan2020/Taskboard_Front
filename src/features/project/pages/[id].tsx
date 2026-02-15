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
import StageUpdateFrom from "@/features/project/components/StageUpdateFrom";
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

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;
    if (!project) return <p>Project not found</p>;

    const sortedStages = [...project.stages].sort((a, b) => {
        const aValue = a.sequence ?? 0;
        const bValue = b.sequence ?? 0;
        return stageSortOrder === "asc" ? aValue - bValue : bValue - aValue;
    });

    // state_name → { label, color } 반환
    const getStateInfo = (state_name?: string) => {
        switch (state_name) {
            case "PLANNED":
                return { label: "PLANNED", color: "bg-planned" };
            case "IN_PROGRESS":
                return { label: "IN_PROGRESS", color: "bg-inProgress" };
            case "DELAYED":
                return { label: "DELAYED", color: "bg-delayed" };
            case "DONE":
                return { label: "DONE", color: "bg-completed" };
            default:
                return { label: "-", color: "bg-planned" };
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
        planned_date: formData.planned_date || undefined,
        act_date: formData.act_date || undefined,
        eta: formData.eta || undefined,
        note: formData.note === "" ? "" : (formData.note || undefined),
        remark: formData.remark === "" ? "" : (formData.remark || undefined),
        eta_change_reason: formData.eta_change_reason || undefined,
    });

    // 단계 생성 폼 데이터 정규화
    const createNormalizeFormData = (formData: StageFromData): CreateProjectStage => {
        return {
            name: formData.name,
            state_id: formData.state_id === "" ? undefined : Number(formData.state_id),

            planned_date: formData.planned_date || undefined,
            act_date: formData.act_date || undefined,
            eta: formData.eta || undefined,

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
                <div className="flex justify-end items-center gap-5">
                    {/* 정렬 */}
                    <button
                        type="button"
                        onClick={toggleStageSortOrder}
                        className="px-3 py-2 border rounded-md hover:bg-gray-100 flex items-center gap-2 text-sm cursor-pointer"
                    >
                        <span className="font-bold">{stageSortOrder === "asc" ? "오름차순" : "내림차순"}</span>
                        <span className="text-xs">{stageSortOrder === "asc" ? "▲" : "▼"}</span>
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
                    <div className="flex gap-5">
                        {/* Left Sidebar */}
                        <div className={`flex-[1] h-fit border rounded-xl gap-0 overflow-hidden`} >
                            <div className={`h-5 ${getStateInfo(project.state_name).color}`}></div>
                            <div className="space-y-5 p-4 h-fit bg-white">
                                {/* Thumbnail */}
                                <div className="space-y-2">
                                    <div className="font-bold text-3xl">{project.title}</div>
                                    <div className="bg-gray-200 h-64 rounded-lg border"></div>
                                </div>

                                {/* Project Info */}
                                <div className="border rounded-xl p-2 truncate whitespace-nowrap">
                                    <table className="w-full table-auto border-collapse text-right">
                                        <tbody>
                                            <tr>
                                                <th className="font-medium">구분 :</th>
                                                <td className="text-gray-900 pl-3 text-left">{project.product_group_name}</td>
                                            </tr>
                                            <tr>
                                                <th className="font-medium">목표일 :</th>
                                                <td className="text-gray-900 pl-3 text-left">{project.goal_due_date}</td>
                                            </tr>
                                            <tr>
                                                <th className="font-medium">담당자 :</th>
                                                <td className="text-gray-900 pl-3 text-left">{project.owner_name}</td>
                                            </tr>
                                            <tr>
                                                <th className="font-medium">유관자 :</th>
                                                <td className="text-gray-900 pl-3 text-left">{project.stage_owner_names.join(", ")}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                {/* Progress */}
                                <div className="">
                                    <div className="text-lg font-semibold mb-2">진행률</div>
                                    <div className="relative w-full h-3 bg-gray-100 rounded-full overflow-hidden border">
                                        <div
                                            className="absolute h-full bg-gray-700"
                                            style={{
                                                width: `${(project.progress.completed / project.progress.total) * 100}%`
                                            }}
                                        ></div>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {project.progress.completed}/{project.progress.total} 단계 {project.progress.total > 0 ? Math.round((project.progress.completed / project.progress.total) * 100) : 0}%
                                    </p>
                                </div>

                                {/* Note or Remark */}
                                <div className="border-gray-300">
                                    <h3 className="text-lg font-semibold mb-2">비고</h3>
                                    <p className="text-gray-700 whitespace-pre-wrap border rounded-lg p-3">
                                        {project.remark || "-"}
                                    </p>
                                </div>
                            </div>
                        </div>
                        {/* Right Content - Stages Table */}
                        <div className="flex-[4] space-y-5">

                            {/* Table */}
                            <div className="border border-1 rounded-lg bg-white overflow-hidden truncate whitespace-nowrap">
                                <table className="w-full table-auto items-center">
                                    {/* Table Header */}
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-center py-3 px-2 text-sm font-medium text-gray-600">
                                                <div className="flex items-center justify-center gap-2">
                                                    <span>Index</span>
                                                </div>
                                            </th>
                                            <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">단계명</th>
                                            <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">상태</th>
                                            <th className="text-center py-3 px-2 text-sm font-medium text-gray-600">실행일</th>
                                            <th className="text-center py-3 px-2 text-sm font-medium text-gray-600">마감일</th>
                                            <th className="text-center py-3 px-2 text-sm font-medium text-gray-600">예상 완료일</th>
                                            <th className="text-center py-3 px-2 text-sm font-medium text-gray-600">담당자</th>
                                            <th className="text-center py-3 px-2 text-sm font-medium text-gray-600"></th>
                                        </tr>
                                    </thead>

                                    {/* Table Body */}
                                    {/* 조건부 렌더링 */}
                                    {project.stages.length < 1 ? (
                                        <tbody>
                                            <tr>
                                                <td
                                                    colSpan={8}
                                                    className="text-center py-20 text-gray-500"
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
                                                            className="last:border-b-0 border-b"
                                                            onContextMenu={(e) => handleContextMenu(e, stage.id)}
                                                        >
                                                            {/* 인덱스 */}
                                                            <td className="py-4 px-2">
                                                                <div className="flex justify-center">
                                                                    <div className="w-8 h-8 rounded-md bg-white border-1 flex items-center justify-center font-medium text-sm">
                                                                        {displayIndex}
                                                                    </div>
                                                                </div>
                                                            </td>

                                                            {/* 상태 (단계명) */}
                                                            <td className="py-3 px-2 items-center">
                                                                <div className="font-medium">{stage.name}</div>
                                                            </td>

                                                            {/* State Badge (상태) */}
                                                            <td className="py-4 px-2 flex items-center justify-center">
                                                                <div className={`text-center items-center justify-center`}>
                                                                    <div
                                                                        className={`w-24 h-8 px-2 flex items-center justify-center rounded-full border-1 border-black text-xs font-medium text-white ${getStateInfo(stage.state_name).color}`}
                                                                    >
                                                                        <div>
                                                                            {getStateInfo(stage.state_name).label}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>

                                                            {/* 실행일 */}
                                                            <td className="py-4 px-2 text-center text-sm">
                                                                {stage.act_date || "-"}
                                                            </td>

                                                            {/* 마감일 */}
                                                            <td className="py-4 px-2 text-center text-sm">
                                                                {stage.planned_date || "-"}
                                                            </td>

                                                            {/* 예상 완료일 */}
                                                            <td className="py-4 px-2 text-center text-sm">
                                                                {stage.eta || "-"}
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
                                                                    className="cursor-pointer"
                                                                >
                                                                    <ModifyIcon />
                                                                </td>
                                                            )
                                                            }
                                                        </tr>
                                                        {/* note / remark row */}
                                                        {(stage.note || stage.remark) && (
                                                            <tr className="border-b last:border-b-0">
                                                                <td colSpan={7} className="pb-2 px-10">
                                                                    <div className="space-y-1 text-base rounded-xl py-2">
                                                                        {stage.note && <p className="text-gray-700">{stage.note}</p>}
                                                                        {stage.remark && <p className="text-red-500">{stage.remark}</p>}
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
