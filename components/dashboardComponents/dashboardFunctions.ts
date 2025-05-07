import toast from "react-hot-toast";
import type { SaveCenarioParamsType } from "./dashboardTypes";

function saveCenario({
  userContext,
  controlForm,
  historicData,
  predictionData,
}: SaveCenarioParamsType) {
  userContext.setCenarios([
    ...userContext.cenarios,
    {
      id: Math.random().toString(),
      params: controlForm,
      historicData: historicData,
      predictionData: predictionData,
    },
  ]);
  toast.success("Saved cenario!");

  return;
}

export { saveCenario };
