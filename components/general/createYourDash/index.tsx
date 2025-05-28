import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import Draggable from "./draggable";
import Droppable from "./droppable";
import { ReactNode, useEffect, useState } from "react";
import TitleComponent from "@/components/UI/titleComponent";
import Card from "./card";
import { dashComponentsList } from "@/components/dashboardComponents/dashboardComponentsMap";
import { handleDragEnd, saveDash } from "./cydHandlers";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableItem from "./sortableItem";
import ButtonGreen from "@/components/UI/buttonGreen";
import { useUser } from "@/contexts/userContext";
import toast from "react-hot-toast";
import { UserType } from "@/utils/types/generalTypes/types";
import { consoleLog } from "@/utils/functions/genericFunctions";

export default function CreateYourDashList(pageProps: { user: UserType }) {
  const { user, setUser } = useUser();
  const [availableComponents, setAvailableComponents] = useState(
    dashComponentsList.map((item) => String(item.id))
  );
  const [dashComponents, setDashComponents] = useState<string[]>(
    user?.preferences?.netFundingDash.map((id) => String(id)) || []
  );

  consoleLog({ availableComponents });
  consoleLog({ dashComponents });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  // Filter dashComponentsList to only show available components
  const dashboardOptions: ReactNode[] = availableComponents
    .map((id) => {
      const component = dashComponentsList.find(
        (comp) => String(comp.id) === id
      );

      const isInDash = pageProps.user.preferences?.netFundingDash.includes(
        Number(id)
      );

      if (!component || isInDash) {
        return null;
      }

      return (
        <Draggable key={id} id={id}>
          <Card
            title={component.title}
            description={component.description}
            icon={component.icon}
          />
        </Draggable>
      );
    })
    .filter(Boolean);

  consoleLog({ dashboardOptions });

  const handleDragEndStaticArgs = {
    availableComponents,
    setAvailableComponents,
    dashComponents,
    setDashComponents,
  };

  useEffect(() => {
    if (!user) {
      setUser(pageProps.user ?? null);
      setDashComponents(
        pageProps.user?.preferences?.netFundingDash.map((id) => String(id)) ||
          []
      );
    }

    return;
  }, []);

  return (
    <div className="pt-12 px-6">
      <TitleComponent htmlTag="h1">Build your dash</TitleComponent>
      <DndContext
        onDragEnd={(event) =>
          handleDragEnd({ ...handleDragEndStaticArgs, event })
        }
        sensors={sensors}
        collisionDetection={closestCenter}
      >
        <div className="flex flex-col gap-4">
          <div className="rounded-xl mt-4">
            <TitleComponent htmlTag="h2">Component options</TitleComponent>
            <Droppable id="component-options-area">
              <div className="flex gap-x-6 gap-y-2 flex-wrap min-h-24 rounded-xl w-full">
                {dashboardOptions.length ? (
                  dashboardOptions
                ) : (
                  <span className="block w-full text-gray-400 p-4">
                    All components were added to your dashboard
                  </span>
                )}
              </div>
            </Droppable>
          </div>
          <div className="w-full">
            <TitleComponent>Your Dashboard</TitleComponent>
            <div id="your-dashboard-area" className="flex gap-12 w-full">
              <Droppable id="user-dashboard-area">
                <div className="p-4 border-2 border-dashed rounded-xl border-spacing-4 w-full min-h-64">
                  {!dashComponents.length && (
                    <span>+ Drop here the components for your dashboard</span>
                  )}
                  <SortableContext
                    items={dashComponents}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="flex flex-col h-fit">
                      {dashComponents.map((id, order) => (
                        <SortableItem key={id} id={id} order={order + 1} />
                      ))}
                    </div>
                  </SortableContext>
                </div>
              </Droppable>
            </div>
          </div>
        </div>
      </DndContext>
      <div className="w-full flex justify-center mt-10">
        <div
          onClick={async () => {
            await toast.promise(saveDash({ user, setUser, dashComponents }), {
              loading: "Saving...",
              success: "Done",
              error: "An error occurred...",
            });
          }}
        >
          <ButtonGreen shadowColor="white/30" shadowSize="md">
            Save
          </ButtonGreen>
        </div>
      </div>
    </div>
  );
}
