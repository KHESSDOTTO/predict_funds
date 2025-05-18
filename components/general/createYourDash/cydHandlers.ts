import { arrayMove } from "@dnd-kit/sortable";
import { Dispatch, SetStateAction } from "react";

function handleDragEnd({
    event,
    dashComponents,
    setDashComponents
}: {event: any, dashComponents: any, setDashComponents: Dispatch<SetStateAction<any>>}) {
    const {active, over} = event;

    if (!over) return;
    
    // Add new
    if (over.id === 'user-dashboard-area' && !dashComponents.includes(active.id)) {
      setDashComponents((prevComponents: string[]) => [...prevComponents, active.id]);
      
      return;
    }
    // End: add new

    // Resort
    if (active.id !== over.id) {
      setDashComponents((items: any) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });
    }
    // End: Resort

    return;
}

export { handleDragEnd };
