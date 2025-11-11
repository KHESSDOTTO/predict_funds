import { ToneColorsInterface } from "@/utils/types/generalTypes/types";
import { ax } from "@/database/axios.config";
import toast from "react-hot-toast";
import type {
  DoLogoutParamsType,
  PredictionsType,
} from "@/utils/types/generalTypes/types";

function capitalize(string: string) {
  switch (string.length) {
    case 0:
      return string;
    case 1:
      return string.toUpperCase();
    default:
      return string[0].toUpperCase() + string.slice(1);
  }
}

function getToneColor(
  value: number,
  toneColors: ToneColorsInterface,
  opacity: number | string
) {
  if (typeof value !== "number") {
    return false;
  }

  const key = value.toFixed(1);
  const original = toneColors[key];
  const start = original.slice(0, -2);
  const end = original.slice(-1);
  const adjustedColor = start + opacity + end;
  return adjustedColor;
}

function pushIfNew(val: any, arr: any[]) {
  const isNew = !arr.includes(val);
  if (isNew) {
    arr.push(val);
  }
}

function consoleLog(varObj: any): void {
  const varName = Object.keys(varObj)[0];
  console.log(`${varName}`);
  console.log(varObj[varName]);
}

async function doLogout({ userContext, router }: DoLogoutParamsType) {
  try {
    userContext.setUser(null);
    await ax.post("/user/logout");
    toast.success("Logged out.");
    router.push("/");
  } catch (err) {
    console.log(err);
    toast.error("Error logging out.");
  }
}

function arrUnique(arr: any[]): any[] {
  const newSet = new Set(arr);
  return Array(newSet);
}

function convertDtComptcToDate(pred: PredictionsType | PredictionsType[]) {
  return Array.isArray(pred)
    ? pred.map((cE) => ({
        ...cE,
        DT_COMPTC: new Date(cE.DT_COMPTC || ""),
      }))
    : {
        ...pred,
        DT_COMPTC: new Date(pred.DT_COMPTC || ""),
      };
}

export {
  capitalize,
  pushIfNew,
  getToneColor,
  consoleLog,
  doLogout,
  arrUnique,
  convertDtComptcToDate,
};
