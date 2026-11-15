import { useEffect, useMemo, useState } from "react";
import { useProjectStore } from "@/features/project/store/project.store";
import { useProductGroupStore } from "@/features/admin/store/productGroup.store";
import { useStateStore } from "@/features/admin/store/state.store";

type Item = { label: string; value: string | number };

function useDebounce<T>(value: T, delay = 250) {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const t = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(t);
    }, [value, delay]);
    return debounced;
}

export default function SearchMyBox() {
    const filters = useProjectStore((s) => s.myPagefilters);
    const setFilters = useProjectStore((s) => s.setMyPageFilters);
    const fetchProductGroups = useProductGroupStore((s) => s.fetchActive);
    const fetchState = useStateStore((s) => s.fetchActive);

    // 프로젝트 구분 select 아이템
    const productGroups = useProductGroupStore((s) => s.items);
    const productGroupItems = useMemo(
        () => [
            { label: "프로젝트 구분 전체", value: "" },
            ...productGroups.map((pg) => ({
                label: pg.name,
                value: pg.id,
            })),
        ],
        [productGroups]
    );

    // 상태 select 아이템
    const states = useStateStore((s) => s.items);
    const stateItems: Item[] = useMemo(
        () => [
            { label: "진행 전체", value: "" },
            ...states.map((st) => ({
                label: st.name,
                value: st.id,
            })),
        ],
        [states]
    );

    // 검색어만 debounce
    const [qLocal, setQLocal] = useState(filters.q ?? "");
    const q = useDebounce(qLocal, 250);

    // 1) 마운트 때만 옵션 데이터 fetch
    useEffect(() => {
        fetchProductGroups();
        fetchState();
    }, [fetchProductGroups, fetchState]);

    // 2) 검색어만 변경될 때 필터 반영
    useEffect(() => {
        setFilters({ q });
    }, [q, setFilters]);

    return (
        <div className="w-full">
            <div className="w-full h-14 flex items-center gap-2 px-2.5 rounded-2xl bg-white ring-1 ring-black/5">
                {/* 왼쪽 select들 */}
                <div className="flex items-center gap-2 h-full">
                    {/* 프로젝트 그룹 */}
                    <div className="min-w-[150px] h-full flex items-center">
                        <select
                            className="select-chevron w-full h-9 pl-4 rounded-full bg-gray-100 hover:bg-gray-200 text-sm text-gray-900 outline-none transition"
                            value={filters.productGroupId ?? ""}
                            onChange={(e) =>
                                setFilters({
                                    productGroupId: e.target.value ? Number(e.target.value) : undefined,
                                })
                            }
                        >
                            {productGroupItems.map((it) => (
                                <option key={String(it.value)} value={it.value}>
                                    {it.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* 상태 */}
                    <div className="min-w-[150px] h-full flex items-center">
                        <select
                            className="select-chevron w-full h-9 pl-4 rounded-full bg-gray-100 hover:bg-gray-200 text-sm text-gray-900 outline-none transition"
                            value={filters.stateId ?? ""}
                            onChange={(e) =>
                                setFilters({
                                    stateId: e.target.value ? Number(e.target.value) : undefined,
                                })
                            }
                        >
                            {stateItems.map((it) => (
                                <option key={String(it.value)} value={it.value}>
                                    {it.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* 검색 input */}
                <div className="flex-1 flex items-center px-3">
                    <input
                        className="w-full bg-transparent outline-none text-sm text-gray-900 placeholder:text-gray-500"
                        placeholder="검색어를 입력해주세요"
                        value={qLocal}
                        onChange={(e) => setQLocal(e.target.value)}
                    />
                </div>

                {/* 돋보기 버튼 */}
                <button
                    type="button"
                    className="btn-primary h-9 px-4 shrink-0"
                    onClick={() => setFilters({ q: qLocal })}
                    aria-label="search"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white">
                        <path
                            d="M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z"
                            stroke="currentColor"
                            strokeWidth="2"
                        />
                        <path
                            d="M21 21l-4.35-4.35"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
}
