import { DndContext, DragEndEvent, UniqueIdentifier } from "@dnd-kit/core";
import Draggable from "./draggable";
import Droppable from "./droppable";
import { useState } from "react";

export default function CreateYourDashList()
{
  const containers = ['A', 'B', 'C'];
  const [parent, setParent] = useState<UniqueIdentifier | null>(null);
  const draggableMarkups = [
    <Draggable id="draggable1">Drag me1</Draggable>,
    <Draggable id="draggable2">Drag me2</Draggable>,
  ];

  return (
    <DndContext onDragEnd={handleDragEnd}>
      {parent === null ? draggableMarkups.map((cE) => cE) : null}

      {containers.map((id) => (
        // We updated the Droppable component so it would accept an `id`
        // prop and pass it to `useDroppable`
        <Droppable key={id} id={id}>
          {parent === id ? draggableMarkups.map((cE) => cE) : 'Drop here'}
        </Droppable>
      ))}
    </DndContext>
  );

  function handleDragEnd(event: DragEndEvent) {
    const {over} = event;

    // If the item is dropped over a container, set it as the parent
    // otherwise reset the parent to `null`
    setParent(over ? over.id : null);
  }
}
