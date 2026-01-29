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
            <div className="w-full h-[44px] flex items-center gap-4 rounded-md bg-white overflow-hidden border">
                {/* 왼쪽 select들 */}
                <div className="flex items-center gap-3 h-full">
                    {/* 프로젝트 그룹 */}
                    <div className="min-w-[140px] h-full border-r pr-3 items-center">
                        <select
                            className="w-full h-full px-3 bg-white text-sm outline-none items-center"
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
                    <div className="min-w-[140px] h-full border-r pr-3 items-center">
                        <select
                            className="w-full h-full px-3 bg-white text-sm outline-none items-center"
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
                <div className="flex-1 flex items-center">
                    <input
                        className="w-full bg-transparent outline-none text-sm placeholder:text-gray-400"
                        placeholder="검색어를 입력해주세요"
                        value={qLocal}
                        onChange={(e) => setQLocal(e.target.value)}
                    />
                </div>

                {/* 돋보기 버튼 */}
                <button
                    type="button"
                    className="w-12 h-full bg-primary flex items-center justify-center shrink-0"
                    onClick={() => setFilters({ q: qLocal })}
                    aria-label="search"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-white">
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
