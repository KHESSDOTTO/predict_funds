import { closestCenter, DndContext, DragEndEvent, KeyboardSensor, PointerSensor, UniqueIdentifier, useSensor, useSensors } from "@dnd-kit/core";
import Draggable from "./draggable";
import Droppable from "./droppable";
import { ReactNode, useState } from "react";
import TitleComponent from "@/components/UI/titleComponent";
import Card from "./card";
import { dashComponentsList } from "@/components/dashboardComponents/dashboardComponentsMap";
import { handleDragEnd } from "./cydHandlers";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SortableItem from "./sortableItem";

export default function CreateYourDashList()
{
  const [dashComponents, setDashComponents] = useState([]);
  const dashboardOptions: ReactNode[] = [];
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  dashComponentsList.forEach((cE) => {
    const { title, description, id, icon } = cE;

    dashboardOptions.push(
      <Draggable id={String(id)}>
        <Card title={title} description={description} icon={icon} />
      </Draggable>
    )
  })

  return (
    <div className="py-12 px-6">
      <TitleComponent htmlTag="h1">Build your dash</TitleComponent>
      <DndContext
        onDragEnd={ (event) => handleDragEnd({event, dashComponents, setDashComponents}) }
        sensors={sensors}
        collisionDetection={closestCenter}
      >
        <div className="flex flex-col gap-4">
          <div className="rounded-xl mt-4">
            <TitleComponent htmlTag="h2">Component options</TitleComponent>
              <Droppable id="component-options-area" disableOver>
                <div className="flex gap-x-6 gap-y-2 flex-wrap">
                  {dashboardOptions.map(cE => cE)}
                </div>
              </Droppable>
          </div>
          <div className="w-full">
            <TitleComponent>Your Dashboard</TitleComponent>
            <div id="your-dashboard-area" className="flex gap-12 w-full">
              <Droppable id='user-dashboard-area'>
                  <div className="p-4 border-2 border-dashed rounded-xl border-spacing-4 w-full h-64">
                    {
                      ! dashComponents.length &&
                        <span>
                          + Drop here the components for your dashboard
                        </span>
                    }
                    <SortableContext
                      items={dashComponents}
                      strategy={verticalListSortingStrategy}
                    >
                      {dashComponents.map(id => <SortableItem key={id} id={id} content="lala" />)}
                    </SortableContext>
                  </div>
              </Droppable>
            </div>
          </div>
        </div>
      </DndContext>
    </div>
  );
}
