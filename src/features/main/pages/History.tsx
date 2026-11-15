import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useProjectHistoryStore } from "../store/projectHistory.store";
import {
    PROJECT_HISTORY_EVENT_TYPE,
    type ProjectHistoryEventType,
    type HistoryEventRangeType,
} from "@/shared/types/project_history.types";
import { useProjectStore } from "@/features/project/store/project.store";
import Select from "@/shared/components/input/HistorySelect";
import "@/shared/lib/styles/Scrollbar.css";

export default function History() {
    const { id } = useParams();
    const projects = useProjectStore((state) => state.projectSummary);
    const navigate = useNavigate();

    // 유효한 프로젝트 ID 결정
    const validProjectId = id && !isNaN(Number(id)) ? Number(id) : projects[0]?.id;

    const [selectedProjectId, setSelectedProjectId] = useState<number>(
        validProjectId || 0
    );

    const { items: histories, loading, error, fetchList } =
        useProjectHistoryStore();

    const [eventTypeFilter, setEventTypeFilter] = useState<ProjectHistoryEventType | "">("");

    const [eventRangeFilter, setEventRangeFilter] = useState<HistoryEventRangeType>("7d");

    const eventTypeItems = [
        { label: "전체", value: "all" },
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

    // 기간 설정
    const eventRangeItems = [
        { label: "Week", value: "7d", },
        { label: "Month", value: "1m", },
        { label: "전체", value: "all", },
    ]

    useEffect(() => {
        if (selectedProjectId && selectedProjectId > 0) {
            fetchList(selectedProjectId, undefined, eventTypeFilter || undefined, eventRangeFilter || undefined);
        }
    }, [selectedProjectId, eventTypeFilter, eventRangeFilter, fetchList]);

    if (loading) return <div className="surface-card p-12 text-center text-[15px] text-gray-500">로딩 중…</div>;
    if (error) return <div className="surface-card p-12 text-center text-[15px] text-danger">오류: {error}</div>;

    const eventBadgeStyle = (type: string) => {
        switch (type) {
            case PROJECT_HISTORY_EVENT_TYPE.STAGE_CREATED:
                return "bg-completed/10 text-completed border-transparent";
            case PROJECT_HISTORY_EVENT_TYPE.STAGE_DELETED:
                return "bg-danger/10 text-danger border-transparent";
            case PROJECT_HISTORY_EVENT_TYPE.STAGE_FIELD_CHANGED:
                return "bg-primary/10 text-primary border-transparent";
            case PROJECT_HISTORY_EVENT_TYPE.PROJECT_FIELD_CHANGED:
                return "bg-amber-50 text-amber-700 border-transparent";
            default:
                return "bg-gray-100 text-gray-700 border-transparent";
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
            case "due_date":
                return "마감일";
            case "eta":
                return "마감 예정일";
            case "completed_date":
                return "실제 완료일";
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
        <div className="pb-6">
            <div className="mx-auto w-full ">
                {/* 필터 */}
                <div className="surface-card mb-4 p-5">
                    <div className="grid grid-cols-3 gap-4">
                        <div>
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
                        <div>
                            <Select
                                label="이벤트"
                                items={eventTypeItems}
                                value={eventTypeFilter}
                                onChange={(value) =>
                                    setEventTypeFilter(value as ProjectHistoryEventType | "")
                                }
                            />
                        </div>
                        <div>
                            <Select
                                label="기간"
                                items={eventRangeItems}
                                value={eventRangeFilter}
                                onChange={(value) =>
                                    setEventRangeFilter(value as HistoryEventRangeType | "")
                                }
                            />
                        </div>
                    </div>
                </div>

                {/* 이력 테이블 */}
                <div className="surface-card overflow-hidden w-full">
                    <table className="w-full border-collapse">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr className="text-xs font-semibold text-gray-500">
                                <th className="pl-5 pr-2 py-3 text-left whitespace-nowrap">이벤트</th>
                                <th className="px-2 py-3 text-left whitespace-nowrap">변경 항목</th>
                                <th className="px-2 py-3 text-left whitespace-nowrap">변경 전</th>
                                <th className="px-2 py-3 text-left whitespace-nowrap">변경 후</th>
                                <th className="px-2 py-3 text-left whitespace-nowrap">변경 사유</th>
                                <th className="px-2 py-3 text-left whitespace-nowrap">변경자</th>
                                <th className="pl-2 pr-5 py-3 text-left whitespace-nowrap">변경 시간</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            {histories.map((history) => (
                                <tr
                                    key={history.id}
                                    className="hover:bg-gray-50 transition cursor-pointer"
                                    onClick={async () => {
                                        navigate(`/project/${history.project_id}`);
                                    }}
                                >
                                    {/* 이벤트 */}
                                    <td className="pl-5 pr-2 py-3.5 whitespace-nowrap">
                                        <span
                                            className={`inline-flex items-center h-6 text-xs font-semibold px-2.5 rounded-full border ${eventBadgeStyle(
                                                history.event_type
                                            )}`}
                                        >
                                            {eventTypeLabel(history.event_type)}
                                        </span>
                                    </td>

                                    {/* 변경 내용 */}
                                    <td className="px-2 py-3.5 text-[13px] font-semibold text-gray-900 text-left whitespace-nowrap">
                                        {fieldLabel(history.field) ?? "-"}
                                    </td>

                                    {/* 변경 전 */}
                                    <td className="px-2 py-3.5 text-[13px] text-gray-700 text-left whitespace-wrap">
                                        <span className="mr-1">
                                            {history.old_value ?? "-"}
                                        </span>
                                    </td>
                                    {/* 변경 후 */}
                                    <td className="px-2 py-3.5 text-[13px] text-gray-700 text-left whitespace-wrap">
                                        <span className=" mr-1">
                                            {history.new_value ?? "-"}
                                        </span>
                                    </td>

                                    {/* 변경 사유 */}
                                    <td className="px-2 py-3.5 text-[13px] text-gray-700">
                                        {history.content ?? "-"}
                                    </td>
                                    {/* 변경 사유 */}
                                    <td className="px-2 py-3.5 text-[13px] text-left text-gray-700 whitespace-nowrap">
                                        {history.changed_by_name ?? " -"}
                                    </td>

                                    {/* 변경 시각 */}
                                    <td className="pl-2 pr-5 py-3.5 text-right text-xs text-gray-500 whitespace-nowrap tabular-nums">
                                        {new Date(history.changed_at).toLocaleString()}
                                    </td>
                                </tr>
                            ))}

                            {histories.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-4 py-16 text-center text-[15px] text-gray-500"
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
