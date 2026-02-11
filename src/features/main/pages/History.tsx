import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useProjectHistoryStore } from "../store/projectHistory.store";
import {
    PROJECT_HISTORY_EVENT_TYPE,
    type ProjectHistoryEventType,
} from "@/shared/types/project_history.types";
import { useProjectStore } from "@/features/project/store/project.store";
import Select from "@/shared/components/input/Select";

export default function History() {
    const { id } = useParams();
    const projects = useProjectStore((state) => state.projectSummary);

    // 유효한 프로젝트 ID 결정
    const validProjectId = id && !isNaN(Number(id)) ? Number(id) : projects[0]?.id;

    const [selectedProjectId, setSelectedProjectId] = useState<number>(
        validProjectId || 0
    );

    const { items: histories, loading, error, fetchList } =
        useProjectHistoryStore();

    const [eventTypeFilter, setEventTypeFilter] = useState<
        ProjectHistoryEventType | ""
    >("");

    const eventTypeItems = [
        { label: "전체", value: "" },
        {
            label: "단계 생성",
            value: PROJECT_HISTORY_EVENT_TYPE.STAGE_CREATED,
        },
        {
            label: "단계 삭제",
            value: PROJECT_HISTORY_EVENT_TYPE.STAGE_DELETED,
        },
        {
            label: "단계 변경",
            value: PROJECT_HISTORY_EVENT_TYPE.STAGE_FIELD_CHANGED,
        },
        {
            label: "프로젝트 생성",
            value: PROJECT_HISTORY_EVENT_TYPE.PROJECT_CREATED,
        },
        {
            label: "프로젝트 삭제",
            value: PROJECT_HISTORY_EVENT_TYPE.PROJECT_DELETED,
        },
        {
            label: "프로젝트 변경",
            value: PROJECT_HISTORY_EVENT_TYPE.PROJECT_FIELD_CHANGED,
        },
    ];

    useEffect(() => {
        if (selectedProjectId && selectedProjectId > 0) {
            fetchList(selectedProjectId, undefined, eventTypeFilter || undefined);
        }
    }, [selectedProjectId, eventTypeFilter, fetchList]);

    if (loading) return <div className="p-6 text-gray-500">로딩 중…</div>;
    if (error) return <div className="p-6 text-red-500">오류: {error}</div>;

    const eventBadgeStyle = (type: string) => {
        switch (type) {
            case PROJECT_HISTORY_EVENT_TYPE.STAGE_CREATED:
                return "bg-green-50 text-green-700 border-green-200";
            case PROJECT_HISTORY_EVENT_TYPE.STAGE_DELETED:
                return "bg-red-50 text-red-700 border-red-200";
            case PROJECT_HISTORY_EVENT_TYPE.STAGE_FIELD_CHANGED:
                return "bg-blue-50 text-blue-700 border-blue-200";
            case PROJECT_HISTORY_EVENT_TYPE.PROJECT_FIELD_CHANGED:
                return "bg-yellow-50 text-yellow-700 border-yellow-200";
            default:
                return "bg-gray-50 text-gray-600 border-gray-200";
        }
    };

    const eventTypeLabel = (type: string) => {
        switch (type) {
            case PROJECT_HISTORY_EVENT_TYPE.STAGE_CREATED:
                return "단계 생성";
            case PROJECT_HISTORY_EVENT_TYPE.STAGE_DELETED:
                return "단계 삭제";
            case PROJECT_HISTORY_EVENT_TYPE.STAGE_FIELD_CHANGED:
                return "단계 변경";
            case PROJECT_HISTORY_EVENT_TYPE.PROJECT_CREATED:
                return "프로젝트 생성";
            case PROJECT_HISTORY_EVENT_TYPE.PROJECT_DELETED:
                return "프로젝트 삭제";
            case PROJECT_HISTORY_EVENT_TYPE.PROJECT_FIELD_CHANGED:
                return "프로젝트 변경";
            default:
                return "  -  ";
        }
    };

    const fieldLabel = (field?: string) => {
        switch (field) {
            // 단계 필드
            case "planned_date":
                return "계획일";
            case "act_date":
                return "실행일";
            case "eta":
                return "완료 예정일";
            case "state_id":
                return "단계 상태";
            case "stage_name":
                return "단계 변경";
            case "note":
                return "업무내용";
            case "stage_owner_id":
                return "단계 담당자";
            // 프로젝트 필드
            case "title":
                return "프로젝트 제목";
            case "thumbnail_url":
                return "썸네일";
            case "goal_due_date":
                return "목표 완료일";
            case "product_group_id":
                return "프로젝트 그룹";
            case "project_state_id":
                return "프로젝트 상태";
            case "remark":
                return "비고";
            case "owner_id":
                return "프로젝트 담당자";
            default:
                return "-";
        }
    };

    return (
        <div className="min-h-screen w-full px-1">
            <div className="mx-auto w-full">
                {/* 필터 */}
                <div className="mb-6 flex justify-end">
                    <div className="flex gap-5">
                        <div className="flex-1">
                            <Select
                                items={projects.map((project) => ({
                                    label: project.title,
                                    value: project.id,
                                }))}
                                value={selectedProjectId}
                                label="프로젝트"
                                onChange={(value) => {
                                    const numValue = Number(value);
                                    if (!isNaN(numValue) && numValue > 0) {
                                        setSelectedProjectId(numValue);
                                    }
                                }}
                            />
                        </div>
                        <div className="flex-1">
                            <Select
                                label="이벤트"
                                items={eventTypeItems}
                                value={eventTypeFilter}
                                onChange={(value) =>
                                    setEventTypeFilter(value as ProjectHistoryEventType | "")
                                }
                            />
                        </div>
                    </div>
                </div>

                {/* 이력 테이블 */}
                <div className="bg-white rounded-lg border overflow-hidden w-full">
                    <table className="w-full border-collapse">
                        <thead className="bg-gray-50 border-b border-gray-400">
                            <tr className="text-xs font-medium text-gray-500">
                                <th className="pl-5 pr-2 py-3 text-left">이벤트</th>
                                <th className="px-2 py-3 text-left">변경 항목</th>
                                <th className="px-2 py-3 text-left">변경 전</th>
                                <th className="px-2 py-3 text-left">변경 후</th>
                                <th className="px-2 py-3 text-left">변경 사유</th>
                                <th className="px-2 py-3 text-left">변경자</th>
                                <th className="pl-2 pr-5 py-3 text-right"></th>
                            </tr>
                        </thead>

                        <tbody className="divide-y">
                            {histories.map((history) => (
                                <tr
                                    key={history.id}
                                    className="hover:bg-gray-50 transition border-b border-gray-200"
                                >
                                    {/* 이벤트 */}
                                    <td className="pl-5 pr-2 py-3 whitespace-nowrap">
                                        <span
                                            className={`inline-block text-xs px-2 py-0.5 rounded-full border ${eventBadgeStyle(
                                                history.event_type
                                            )}`}
                                        >
                                            {eventTypeLabel(history.event_type)}
                                        </span>
                                    </td>

                                    {/* 변경 내용 */}
                                    <td className="px-2 py-3 text-xs text-gray-700 text-left whitespace-nowrap">
                                        {fieldLabel(history.field) ?? "-"}
                                    </td>

                                    {/* 변경 전 */}
                                    <td className="px-2 py-3 text-xs text-left whitespace-nowrap">
                                        <span className="mr-1">
                                            {history.old_value ?? "-"}
                                        </span>
                                    </td>
                                    {/* 변경 후 */}
                                    <td className="px-2 py-3 text-xs text-left whitespace-nowrap">
                                        <span className=" mr-1">
                                            {history.new_value ?? "-"}
                                        </span>
                                    </td>

                                    {/* 변경 사유 */}
                                    <td className="px-2 py-3 text-xs text-gray-600">
                                        {history.content ?? "-"}
                                    </td>
                                    {/* 변경 사유 */}
                                    <td className="px-2 py-3 text-xs text-left text-gray-600 whitespace-nowrap">
                                        {history.changed_by_name ?? " -"}
                                    </td>

                                    {/* 변경 시각 */}
                                    <td className="pl-2 pr-5 py-3 text-right text-xs text-gray-400 whitespace-nowrap">
                                        {new Date(history.changed_at).toLocaleString()}
                                    </td>
                                </tr>
                            ))}

                            {histories.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-4 py-10 text-center text-sm text-gray-400"
                                    >
                                        변경 이력이 없습니다.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
}
