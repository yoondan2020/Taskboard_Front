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
            ? "px-3 py-1.5 rounded-md bg-hover text-gray-900 font-semibold"
            : "px-3 py-1.5 rounded-md text-gray-600 hover:bg-hover";

    return (
        <div className="p-1 flex flex-col gap-px cursor-pointer text-sm
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
