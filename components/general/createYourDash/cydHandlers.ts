import { arrayMove } from "@dnd-kit/sortable";
import { HandleDragEndParamsType } from "./cydTypes";

function handleDragEnd ({
  event,
  availableComponents,
  setAvailableComponents,
  dashComponents,
  setDashComponents
}: HandleDragEndParamsType) {
  const {active, over} = event;
  
  if (!over) return;
  
  // Adding from options to dashboard
  if (over.id === 'user-dashboard-area' && availableComponents.includes(active.id as string)) {
    // Add to dashboard
    setDashComponents(prev => [...prev, active.id as string]);
    // Remove from available components
    setAvailableComponents(prev => prev.filter(id => id !== active.id));
    return;
  }
  
  // Removing from dashboard (dragging to options area or anywhere else outside)
  if (over.id === 'component-options-area' && dashComponents.includes(active.id as string)) {
    // Remove from dashboard
    setDashComponents(prev => prev.filter(id => id !== active.id));
    // Add back to available components
    setAvailableComponents(prev => [...prev, active.id as string]);
    return;
  }
  
  // Reordering within dashboard
  if (dashComponents.includes(active.id as string) && dashComponents.includes(over.id as string) && active.id !== over.id) {
    setDashComponents(items => {
      const oldIndex = items.indexOf(active.id as string);
      const newIndex = items.indexOf(over.id as string);
      
      return arrayMove(items, oldIndex, newIndex);
    });
  }
};

function saveDash()
{
  return;
}

export { handleDragEnd, saveDash };
