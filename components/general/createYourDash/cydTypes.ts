import { DragEndEvent } from "@dnd-kit/core";
import { Dispatch, ReactNode, SetStateAction } from "react";

interface CYDDraggablePropsType {
  children?: ReactNode;
  id: string;
}

interface CYDDroppablePropsType extends CYDDraggablePropsType {
  disableOver?: boolean;
}

interface CardPropsType {
  order?: number;
  title: string;
  description: string;
  icon: ReactNode;
}

interface SortableItemPropsType {
  id: string;
  key: string;
  order?: number;
}

type HandleDragEndParamsType = {
  event: any;
  dashComponents: string[];
  setDashComponents: Dispatch<SetStateAction<string[]>>;
};

export type {
  CYDDroppablePropsType,
  CYDDraggablePropsType,
  SortableItemPropsType,
  CardPropsType,
  HandleDragEndParamsType,
};
