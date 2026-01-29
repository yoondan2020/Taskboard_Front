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
        key === selected ? "font-semibold" : "text-gray-400";

    return (
        <div className="flex flex-col text-right px-3 py-5 gap-3 cursor-pointer mt-11
        2xl:text-xl xl:text-lg lg:text-lg md:text-lg sm:text-lg text-lg
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
