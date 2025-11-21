import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Helpers from "./helpers";
import { PredictionsType } from "@/utils/types/generalTypes/types";

describe("Helpers function capitalize()", () => {
  it('Should return "I am fine, thanks." for "i am fine, thanks."', () => {
    expect(Helpers.capitalize("i am fine, thanks")).toBe("I am fine, thanks");
  });

  it('Should return "John is the goat" for "john is the goat"', () => {
    expect(Helpers.capitalize("john is the goat")).toBe("John is the goat");
  });

  it('Should return "" for ""', () => {
    expect(Helpers.capitalize("")).toBe("");
  });

  it('Should return "A" for "a"', () => {
    expect(Helpers.capitalize("a")).toBe("A");
  });
});

describe("getToneColor()", () => {
  const dummyMapColors = {
    "-1.0": "rgba(185, 28, 28, 1)", // dark red
    "-0.9": "rgba(200, 60, 60, 1)", // medium dark red
    "-0.8": "rgba(220, 90, 90, 1)", // red
    "-0.7": "rgba(235, 120, 120, 1)", // medium red
    "-0.6": "rgba(250, 150, 150, 1)", // light red
    "-0.5": "rgba(255, 180, 180, 1)", // lighter red
    "-0.4": "rgba(255, 210, 210, 1)", // very light red
    "-0.3": "rgba(255, 235, 235, 1)", // very light pink
    "-0.2": "rgba(255, 245, 245, 1)", // almost white with a hint of pink
    "-0.1": "rgba(255, 250, 250, 1)", // very very light pink
    "-0.0": "rgba(255, 255, 255, 1)", // white
    "0.0": "rgba(255, 255, 255, 1)", // white
    "0.1": "rgba(235, 245, 235, 1)", // very very light green
    "0.2": "rgba(210, 230, 210, 1)", // very light green
    "0.3": "rgba(185, 215, 185, 1)", // light green
    "0.4": "rgba(160, 200, 160, 1)", // lighter green
    "0.5": "rgba(135, 185, 135, 1)", // medium light green
    "0.6": "rgba(110, 170, 110, 1)", // green
    "0.7": "rgba(85, 155, 85, 1)", // medium green
    "0.8": "rgba(60, 140, 60, 1)", // darker green
    "0.9": "rgba(40, 125, 40, 1)", // dark green
    "1.0": "rgba(20, 110, 20, 1)", // very dark green
  };

  it("Return 'rgba(85, 155, 85, 1)' for value 0.7 and opacity 1", () => {
    expect(Helpers.getToneColor(0.7, dummyMapColors, 1));
  });

  it("Return 'rgba(200, 60, 60, 0.6)' for value -0.9 and opacity 0.6", () => {
    expect(Helpers.getToneColor(-0.9, dummyMapColors, 0.6));
  });

  it("Return 'rgba(255, 255, 255, 0)' for value 0.0 and opacity 0", () => {
    expect(Helpers.getToneColor(0.0, dummyMapColors, 0));
  });
});

describe("consoleLog()", () => {
  const varTest = 55;

  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("Should log the variable name and value when passed an object", () => {
    Helpers.consoleLog({ varTest });

    expect(console.log).toHaveBeenCalledTimes(2);
    expect(console.log).toHaveBeenNthCalledWith(1, "varTest");
    expect(console.log).toHaveBeenNthCalledWith(2, 55);
  });

  it("Should handle objects with string values", () => {
    const testString = "hello";

    Helpers.consoleLog({ testString });

    expect(console.log).toHaveBeenCalledTimes(2);
    expect(console.log).toHaveBeenNthCalledWith(1, "testString");
    expect(console.log).toHaveBeenNthCalledWith(2, "hello");
  });

  it("Should handle objects with complex values", () => {
    const testObj = { nested: "value" };

    Helpers.consoleLog({ testObj });

    expect(console.log).toHaveBeenCalledTimes(2);
    expect(console.log).toHaveBeenNthCalledWith(1, "testObj");
    expect(console.log).toHaveBeenNthCalledWith(2, { nested: "value" });
  });

  it("Should handle empty objects without throwing", () => {
    expect(() => Helpers.consoleLog({})).not.toThrow();
    expect(console.log).toHaveBeenCalledTimes(2);
    expect(console.log).toHaveBeenNthCalledWith(1, "undefined");
    expect(console.log).toHaveBeenNthCalledWith(2, undefined);
  });
});

// describe("doLogout()", () => {
/* To be implemented!! */
// });

describe("arrUnique", () => {
  it("Should return same array if not duplicated", () => {
    const arr1 = ["a", "b", "c", "d"];
    const arr2 = [1, 2, 3, 4, 5];
    const arr3 = ["a", "b", 2, "d"];

    expect(Helpers.arrUnique(arr1)).toEqual(arr1);
    expect(Helpers.arrUnique(arr2)).toEqual(arr2);
    expect(Helpers.arrUnique(arr3)).toEqual(arr3);
  });

  it("Should return unique values if array has duplicated elements", () => {
    const arr1 = {
      input: ["a", "b", "c", "c"],
      output: ["a", "b", "c"],
    };
    const arr2 = {
      input: [1, 2, 2, 4, 5],
      output: [1, 2, 4, 5],
    };
    const arr3 = {
      input: [0, 0, 2, "d"],
      output: [0, 2, "d"],
    };

    expect(Helpers.arrUnique(arr1.input)).toEqual(arr1.output);
    expect(Helpers.arrUnique(arr2.input)).toEqual(arr2.output);
    expect(Helpers.arrUnique(arr3.input)).toEqual(arr3.output);
  });

  it('Should not automatically convert types, "2" and 2 should not be treated as equals', () => {
    const arr = ["2", 2, true, 0, "0", false];

    expect(Helpers.arrUnique(arr)).toEqual(arr);
  });
});

describe("convertDtComptcToDate()", () => {
  it("Should return field DT_COMPTC formatted as date when PredictionsType Type gets passed", () => {
    const objTest = {
      DT_COMPTC: "08/08/2022",
      CNPJ_FUNDO: "string",
      CI90_ABS: 1,
      CI95_ABS: 1,
      CI99_ABS: 1,
      CI90_PCT: 1,
      CI95_PCT: 1,
      CI99_PCT: 1,
      CI90_ABS_limits: [1, 2],
      CI95_ABS_limits: [1, 2],
      CI99_ABS_limits: [1, 2],
      CI90_PCT_limits: [1, 2],
      CI95_PCT_limits: [1, 2],
      CI99_PCT_limits: [1, 2],
      mean: 1,
    } as unknown as PredictionsType; // Fix this -> done due to type issue/mismatch on api
    const result = Helpers.convertDtComptcToDate(objTest) as PredictionsType;

    expect(result["DT_COMPTC"]).toBeInstanceOf(Date);
  });
  it("Should return every element's field DT_COMPTC formatted as date when PredictionsType[] Type gets passed", () => {
    const arrTest = [
      {
        DT_COMPTC: "08/08/2022",
        CNPJ_FUNDO: "string",
        CI90_ABS: 1,
        CI95_ABS: 1,
        CI99_ABS: 1,
        CI90_PCT: 1,
        CI95_PCT: 1,
        CI99_PCT: 1,
        CI90_ABS_limits: [1, 2],
        CI95_ABS_limits: [1, 2],
        CI99_ABS_limits: [1, 2],
        CI90_PCT_limits: [1, 2],
        CI95_PCT_limits: [1, 2],
        CI99_PCT_limits: [1, 2],
        mean: 1,
      },
      {
        DT_COMPTC: "08/08/2022",
        CNPJ_FUNDO: "string",
        CI90_ABS: 1,
        CI95_ABS: 1,
        CI99_ABS: 1,
        CI90_PCT: 1,
        CI95_PCT: 1,
        CI99_PCT: 1,
        CI90_ABS_limits: [1, 2],
        CI95_ABS_limits: [1, 2],
        CI99_ABS_limits: [1, 2],
        CI90_PCT_limits: [1, 2],
        CI95_PCT_limits: [1, 2],
        CI99_PCT_limits: [1, 2],
        mean: 1,
      },
    ] as unknown[] as PredictionsType[]; // Fix this -> done due to type issue/mismatch on api
    const result = Helpers.convertDtComptcToDate(arrTest) as PredictionsType[];

    expect(result[0]["DT_COMPTC"]).toBeInstanceOf(Date);
    expect(result[1]["DT_COMPTC"]).toBeInstanceOf(Date);
  });
});
