import { useDevice } from "@/contexts/deviceContext";
import { CardPropsType } from "./cydTypes";

export default function Card({
    order,
    title,
    description,
    icon,
}: CardPropsType) {
    const { isMobile } = useDevice();

    return (
        <div
            className="bg-white/20 grow-1 h-32 active:bg-white/60 hover:bg-white/30 rounded-xl shadow-md p-4 mb-3 border border-gray-200 text-left"
        >
            <h4 className="font-bold text-lg mb-2 flex justify-between">
                <span>
                    {order && <span>{order}.&nbsp;</span>}
                    <span>{title}</span>
                </span>
                {icon}
            </h4>
            <p className="text-sm text-ellipsis">
                {description}
            </p>
        </div>
    )
}