import { CardPropsType } from "./cydTypes";

export default function Card({
    title,
    description,
    icon
}: CardPropsType) {
    return (
        <div className="bg-white/20 w-96 h-32 active:bg-white/60 hover:bg-white/30 rounded-xl shadow-md p-4 mb-3 border border-gray-200 text-left">
            <h4 className="font-bold text-lg mb-2 flex justify-between">
                <span>
                    {title}
                </span>
                {icon}
            </h4>
            <p className="text-sm text-ellipsis">
                {description}
            </p>
        </div>
    )
}