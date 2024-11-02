import { HandleFadeOutArgsType } from "./cenarioCardTypes";

function handleFadeOut({
  id,
  setIsFadingOut,
  excludeCenarioFunction,
}: HandleFadeOutArgsType): void {
  setIsFadingOut(true);
  setTimeout(() => {
    excludeCenarioFunction(id);
  }, 300);
}

export { handleFadeOut };
