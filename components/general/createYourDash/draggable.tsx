import { useDraggable } from "@dnd-kit/core";
import { CYDDroppablePropsType } from "./cydTypes";
import { useDevice } from "@/contexts/deviceContext";

export default function Draggable({ children, id }: CYDDroppablePropsType) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
  });
  const { isMobile } = useDevice();

  let style: React.CSSProperties = {
    touchAction: "none",
    overflow: "hidden",
    flexGrow: 1,
    maxWidth: isMobile ? "100%" : "24%",
    cursor: "grab", // Add cursor feedback
  };

  if (transform) {
    style = {
      ...style,
      transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      cursor: "grabbing", // Change cursor while dragging
    };
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      role="button" // For accessibility
      tabIndex={0} // For keyboard accessibility
    >
      {children}
    </div>
  );
}
