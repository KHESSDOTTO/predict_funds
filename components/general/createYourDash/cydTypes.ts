import { ReactNode } from "react";

interface CYDDraggablePropsType  {
    children?: ReactNode;
    id: string;
}

interface CYDDroppablePropsType extends CYDDraggablePropsType {
    disableOver?: boolean
}

interface CardPropsType {
    title: string;
    description: string;
    icon: ReactNode;
}

interface SortableItemPropsType {
    id: string;
    content: string
}

export type {
    CYDDroppablePropsType,
    CYDDraggablePropsType,
    SortableItemPropsType,
    CardPropsType
}
