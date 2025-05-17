import { ReactNode } from "react";

interface CYDDraggablePropsType  {
    children: ReactNode;
    id: string;
}

interface CYDDroppablePropsType extends CYDDraggablePropsType {}

export type {
    CYDDroppablePropsType,
    CYDDraggablePropsType
}
