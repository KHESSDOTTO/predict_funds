import { ToneColorsInterface } from "../utils/types";

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

function generateYaxisTicksBasedOnMaxMod(
  maxMod: number,
  isPct: boolean,
  maxValueTick = 100000,
  numTicks = 9,
  times = 1
) {
  const ticks: number[] = [];

  const adjustMaxValueTick = isPct && times === 1 ? 0.05 : maxValueTick;

  if (maxMod <= adjustMaxValueTick || times > 50) {
    // Prevent infinite recursion by limiting times
    const minTick = -adjustMaxValueTick;
    const maxTick = adjustMaxValueTick;
    const step = (maxTick - minTick) / (numTicks - 1);

    for (let i = 0; i < numTicks; i++) {
      ticks.push(minTick + step * i);
    }

    return ticks;
  }

  let newMaxValueTick = adjustMaxValueTick;
  const newMaxFirstTime = isPct ? 0.1 : 200000;
  const newMaxSecondTime = isPct ? 0.15 : 500000;
  const defaultStep = isPct ? 0.05 : 500000;

  if (times == 1) {
    newMaxValueTick = newMaxFirstTime;
  } else if (times == 2) {
    newMaxValueTick = newMaxSecondTime;
  } else {
    newMaxValueTick += defaultStep; // Simplify the logic for increasing maxValueTick
  }

  return generateYaxisTicksBasedOnMaxMod(
    maxMod,
    isPct,
    newMaxValueTick,
    numTicks,
    times + 1
  );
}

function generateYaxisDomainBasedOnMaxMod(
  maxMod: number,
  isPct: boolean,
  maxValueTick = 100000,
  times = 1
) {
  const adjustMaxValueTick = isPct && times === 1 ? 0.05 : maxValueTick;

  if (maxMod <= adjustMaxValueTick || times > 50) {
    // Prevent infinite recursion
    const minTick = -adjustMaxValueTick;
    const maxTick = adjustMaxValueTick;

    const domain = [minTick, maxTick];
    return domain;
  }

  // Adjust newMaxValueTick based on the current attempt (times)
  let newMaxValueTick = adjustMaxValueTick;
  const newMaxFirstTime = isPct ? 0.1 : 200000;
  const newMaxSecondTime = isPct ? 0.15 : 500000;
  const defaultStep = isPct ? 0.05 : 500000;

  if (times == 1) {
    newMaxValueTick = newMaxFirstTime;
  } else if (times == 2) {
    newMaxValueTick = newMaxSecondTime;
  } else {
    newMaxValueTick += defaultStep; // Simplify the logic for increasing maxValueTick
  }

  return generateYaxisDomainBasedOnMaxMod(
    maxMod,
    isPct,
    newMaxValueTick,
    times + 1
  );
}

function formatNumToStrMlnK(number: number, roundUp: boolean = false): string {
  const absVal: number = Math.abs(number);
  const neg: boolean = number < 0;
  const localeString = "en-US";
  let num = absVal;
  let roundedNum: number;
  let add: string = "";

  if (absVal >= 10 ** 6) {
    num = absVal / 10 ** 5; // To keep one decimal place after rounding
    add = " mln";
  } else if (absVal >= 10 ** 3) {
    num = absVal / 10 ** 3;
    add = " k";
  }

  if (roundUp) {
    roundedNum = Math.ceil(num);
  } else {
    roundedNum = Math.floor(num);
  }

  // Adding one decimal place to mln
  if (absVal >= 10 ** 6) {
    roundedNum = roundedNum / 10;
  }

  const formattedNum: string = neg
    ? "(" + roundedNum.toLocaleString(localeString) + add + ")"
    : roundedNum.toLocaleString(localeString) + add;

  return formattedNum;
}

function formatNumToPctStr(number: number, decimalPlaces: number) {
  let formattedNum: string;

  if (number < 0) {
    formattedNum = number.toFixed(decimalPlaces) + "%";
  } else {
    formattedNum = "(" + number.toFixed(decimalPlaces) + "%" + ")";
  }

  return formattedNum;
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

export {
  capitalize,
  pushIfNew,
  getToneColor,
  generateYaxisTicksBasedOnMaxMod,
  generateYaxisDomainBasedOnMaxMod,
  buildPredKey,
  consoleLog,
  formatNumToStrMlnK,
  formatNumToPctStr,
};
