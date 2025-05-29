import { UserType } from "@/utils/types/generalTypes/types";
import { arrayMove } from "@dnd-kit/sortable";
import { Dispatch, SetStateAction } from "react";
import { ax } from "@/database/axios.config";
import { HandleDragEndParamsType } from "./cydTypes";

function handleDragEnd({
  event,
  dashComponents,
  setDashComponents,
}: HandleDragEndParamsType) {
  const { active, over } = event;

  if (!over) return;

  const activeId = active.id as string;
  const overId = over.id as string;

  // Adding from options to dashboard
  if (overId === "user-dashboard-area" && !dashComponents.includes(activeId)) {
    // Add to dashboard
    setDashComponents((prev) => [...prev, activeId]);
    return;
  }

  // Removing from dashboard (dragging to options area)
  if (
    overId === "component-options-area" &&
    dashComponents.includes(activeId)
  ) {
    // Remove from dashboard
    setDashComponents((prev) => prev.filter((id) => id !== activeId));
    return;
  }

  // Reordering within dashboard
  if (
    dashComponents.includes(activeId) &&
    dashComponents.includes(overId) &&
    activeId !== overId
  ) {
    setDashComponents((items) => {
      const oldIndex = items.indexOf(activeId);
      const newIndex = items.indexOf(overId);

      return arrayMove(items, oldIndex, newIndex);
    });
  }
}

async function saveDash({
  user,
  setUser,
  dashComponents,
}: {
  user: UserType | null;
  setUser: Dispatch<SetStateAction<UserType | null>>;
  dashComponents: string[];
}): Promise<boolean> {
  if (!user) {
    return false;
  }

  const newDash = dashComponents.map((cE) => Number(cE));
  const data = {
    preferences: {
      netFundingDash: newDash,
    },
  };
  let result;

  try {
    await ax.post(`/user/edit/${user?._id}`, data);
    setUser({ ...user, ...data });

    result = true;
  } catch (err) {
    console.error(err);

    result = false;
  }

  return result;
}

export { handleDragEnd, saveDash };
