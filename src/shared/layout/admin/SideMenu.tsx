// SideMenu.tsx
type MenuKey = "productGroup" | "state" | "stage" | "user";

export default function SideMenu({
    selected,
    onSelect,
}: {
    selected: MenuKey;
    onSelect: (m: MenuKey) => void;
}) {
    const itemClass = (key: MenuKey) =>
        key === selected
            ? "px-4 py-2.5 rounded-xl bg-primary/10 text-primary font-semibold"
            : "px-4 py-2.5 rounded-xl text-gray-700 hover:bg-gray-100";

    return (
        <div className="surface-card p-2 flex flex-col gap-1 cursor-pointer text-[15px]
        //border border-gray-300 rounded-lg
        ">
            <div className={itemClass("productGroup")} onClick={() => onSelect("productGroup")}>
                프로젝트 구분
            </div>
            <div className={itemClass("stage")} onClick={() => onSelect("stage")}>
                단계 관리
            </div>
            <div className={itemClass("user")} onClick={() => onSelect("user")}>
                사용자 관리
            </div>
        </div>
    );
}
