import { HandleFadeOutParamsType } from "./cenarioCardTypes";

function handleFadeOut({
  id,
  cenarios,
  setCenarios,
  setIsFadingOut,
  excludeCenarioFunction,
}: HandleFadeOutParamsType): void {
  setIsFadingOut(true);
  setTimeout(() => {
    excludeCenarioFunction({ cenarioId: id, cenarios, setCenarios });
  }, 300);
}

export { handleFadeOut };
