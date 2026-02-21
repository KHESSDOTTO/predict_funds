import { ToneColorsInterface } from "@/utils/types/generalTypes/types";
import { ax } from "@/database/axios.config";
import toast from "react-hot-toast";
import type {
  DoLogoutParamsType,
  PredictionsType,
} from "@/utils/types/generalTypes/types";

/**
 * Class for all generic helpers used on the project (not related to any specific functionality)
 * @class
 */
class Helpers {
  /**
   * Capitalize first letter of string
   * @param string string to be capitalized
   * @returns string containing first letter capitalized
   */
  static capitalize(string: string): string {
    switch (string.length) {
      case 0:
        return string;
      case 1:
        return string.toUpperCase();
      default:
        return string[0].toUpperCase() + string.slice(1);
    }
  }

  /**
   * Gets a string representing a rgba color based on a numeric value passed. Color
   * mapping done according to some object provided as toneColors in format
   * "string representation of a number": "rgba string".
   * @param value value that will correspond to a key on the toneColors map (object)
   * @param toneColors object that maps numbers (string representation) to colors (rgba)
   * @param opacity opacity of color
   * @returns string representing rgba color
   */
  static getToneColor(
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

  /**
   * Pushes an element into an array only if it does not contain a similar element already.
   * @param val Value to be pushed into an array
   * @param arr array that the value will be puched into
   */
  static pushIfNew(val: any, arr: any[]): void {
    const isNew = !arr.includes(val);
    if (isNew) {
      arr.push(val);
    }
  }

  /**
   * Shorthand for logging the name of a variable and then its actual value right afterwards.
   * It is equivalent to console.log(varName); console.log(varVal);
   * @param varObj Object containing the variable to be logged into the console
   */
  static consoleLog(varObj: any): void {
    const varName = Object.keys(varObj)[0];
    console.log(`${varName}`);
    console.log(varObj[varName]);
  }

  /**
   * Async function to execute logout of user on the frontend. Sets user in context to null and calls
   * API endpoint to do logout - exclude cookies, current auth content, etc.
   * Redirects to home page (logged out home).
   * @param param0 Object containing user context and router
   */
  static async doLogout({
    userContext,
    router,
  }: DoLogoutParamsType): Promise<void> {
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

  /**
   * Strips duplicate values from an array
   * @param arr Array to be converted to only unique elements
   * @returns array with only one occurence of each value
   */
  static arrUnique(arr: any[]): any[] {
    const newSet = new Set(arr);

    return Array.from(newSet);
  }

  /**
   * Converts property/field DT_COMPTC of an object or array of objects into type Date instead of string or any other.
   * @param pred Prediction object or array of objects
   * @returns same as input, but field named DT_COMPTC has now a Date type values instead of string or any other.
   */
  static convertDtComptcToDate(pred: PredictionsType | PredictionsType[]) {
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
}

export default Helpers;
