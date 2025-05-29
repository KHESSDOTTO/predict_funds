import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { CYDDroppablePropsType } from "./cydTypes";
import { useDevice } from "@/contexts/deviceContext";

export default function Draggable({ children, id }: CYDDroppablePropsType) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
  });
  const { isMobile } = useDevice();
  let style: React.CSSProperties = {
    touchAction: "none", // Evitar drag com scroll em mobile
    flexGrow: 1,
    maxWidth: isMobile ? "100%" : "24%",
  };

  if (transform) {
    style = {
      ...style,
      transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    };
  }

  return (
    <button ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </button>
  );
}
