import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SortableItemPropsType } from "./cydTypes";

// SortableItem component
export default function SortableItem ({
    id,
    content
}: SortableItemPropsType)
{
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="px-4 py-3 my-2 bg-white rounded-lg shadow cursor-grab active:cursor-grabbing border border-gray-200 hover:border-blue-400 transition-colors"
      {...attributes} 
      {...listeners}
    >
      {content}
    </div>
  );
};
