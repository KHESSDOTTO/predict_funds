import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Card from "./card";
import { dashComponentsList } from "@/components/dashboardComponents/dashboardComponentsMap";
import { SortableItemPropsType } from "./cydTypes";

export default function SortableItem({
  order,
  id,
  key,
}: SortableItemPropsType) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    flexGrow: 1,
  };

  // Find the component data by ID
  const componentData = dashComponentsList.find(
    (comp) => String(comp.id) === id
  );

  if (!componentData) {
    return null;
  }

  return (
    <div
      ref={setNodeRef}
      key={key}
      style={style}
      {...attributes}
      {...listeners}
    >
      <Card
        order={order}
        title={componentData.title}
        description={componentData.description}
        icon={componentData.icon}
      />
    </div>
  );
}
