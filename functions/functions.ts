import { ToneColorsInterface } from "../utils/types";
import { ax } from "@/database/axios.config";
import toast from "react-hot-toast";
import type { DoLogoutArgsType } from "../utils/types";

function capitalize(string: string) {
  consoleLog({ string });
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

function buildPredKey(
  varCota: string | number,
  varCotistas: string | number,
  varNF: string | number,
  absOrPct: "abs" | "pct"
): string {
  const mapPrefix: any = {
    abs: "abs_BRL",
    pct: "pct_PL",
  };

  const predKey = [
    mapPrefix[absOrPct],
    (Number(varCota) * 100)
      .toFixed(1)
      .replaceAll(".", "_")
      .replaceAll("-", "n"),
    (Number(varCotistas) * 100)
      .toFixed(1)
      .replaceAll(".", "_")
      .replaceAll("-", "n"),
    (Number(varNF) * 100).toFixed(1).replaceAll(".", "_").replaceAll("-", "n"),
  ].join("__");

  return predKey;
}

function consoleLog(varObj: any): void {
  const varName = Object.keys(varObj)[0];
  console.log(`${varName}`);
  console.log(varObj[varName]);
}

async function doLogout({ userContext, router }: DoLogoutArgsType) {
  try {
    userContext.setUser(null);
    userContext.setCenarios([]);
    await ax.post("/user/logout");
    toast.success("Logged out.");
    router.push("/");
  } catch (err) {
    console.log(err);
    toast.error("Error logging out.");
  }
}

export {
  capitalize,
  pushIfNew,
  getToneColor,
  buildPredKey,
  consoleLog,
  doLogout,
};
