import {
  RawHistogramData,
  FinalHistogramData,
  ToneColorsInterface,
} from "../utils/types";

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

function prepareHistogram(
  histogramData: RawHistogramData[],
  numBars: number,
  selCnpj: string
): FinalHistogramData | false {
  if (!histogramData || histogramData.length === 0) return false; // Won't run if there is no histogramData or lenght of array = 0

  let stepAbs: number;
  let cValAbs: number;
  let stepPct: number;
  let cValPct: number;
  const limits: { abs: number[]; pct: number[] } = {
    abs: [],
    pct: [],
  };
  const xTicks: { abs: string[]; pct: string[] } = {
    abs: [],
    pct: [],
  };
  const values: { abs: number[]; pct: number[] } = {
    abs: [],
    pct: [],
  };
  let selCnpjBin: { abs: boolean[]; pct: boolean[] } = {
    abs: [],
    pct: [],
  };

  const minValAbs = histogramData.reduce((min, cE) => {
    return cE["CAPTC_LIQ_ABS_ms"] < min ? cE["CAPTC_LIQ_ABS_ms"] : min;
  }, histogramData[0]["CAPTC_LIQ_ABS_ms"]);

  const maxValAbs = histogramData.reduce((max, cE) => {
    return cE["CAPTC_LIQ_ABS_ms"] > max ? cE["CAPTC_LIQ_ABS_ms"] : max;
  }, histogramData[0]["CAPTC_LIQ_ABS_ms"]);

  const minValPct = histogramData.reduce((min, cE) => {
    return cE["CAPTC_LIQ_PCT_ms"] < min ? cE["CAPTC_LIQ_PCT_ms"] : min;
  }, histogramData[0]["CAPTC_LIQ_PCT_ms"]);

  const maxValPct = histogramData.reduce((max, cE) => {
    return cE["CAPTC_LIQ_PCT_ms"] > max ? cE["CAPTC_LIQ_PCT_ms"] : max;
  }, histogramData[0]["CAPTC_LIQ_PCT_ms"]);

  stepAbs = (maxValAbs - minValAbs) / numBars;
  stepPct = (maxValPct - minValPct) / numBars;

  cValAbs = minValAbs;
  cValPct = minValPct;

  // Defining values for limits and xTicks arrays
  for (let i = 0; i < numBars; i++) {
    const lowerEndAbs = cValAbs;
    const upperEndAbs = cValAbs + stepAbs;

    const lowerEndPct = cValPct;
    const upperEndPct = cValPct + stepPct;

    const separator = " | ";

    const tickAbs =
      formatNumToStrMlnK(lowerEndAbs, false) +
      separator +
      formatNumToStrMlnK(upperEndAbs, i === numBars - 1); // If it is the last limit, than roundUp (true)
    const tickPct =
      lowerEndPct.toFixed(1) + "%" + separator + upperEndPct.toFixed(1) + "%";

    xTicks.abs.push(tickAbs);
    limits.abs.push(upperEndAbs); // No rounding on this array to count the elements in each interval of values
    values.abs.push(0);
    selCnpjBin.abs.push(false);
    cValAbs = upperEndAbs;

    xTicks.pct.push(tickPct);
    limits.pct.push(upperEndPct); // No rounding on this array to count the elements in each interval of values
    values.pct.push(0);
    selCnpjBin.pct.push(false);
    cValPct = upperEndPct;
  }
  // End of limits and xTicks arrays

  // Count elements on each interval of values to be the Yaxis values (based on 'limits' array for both abs and Pct)
  histogramData.forEach((cE) => {
    // Abs values
    const indexAbs = limits.abs.findIndex(
      (limit) => cE["CAPTC_LIQ_ABS_ms"] <= limit
    );
    if (indexAbs !== -1) {
      values.abs[indexAbs]++;
    }
    if (cE.CNPJ_FUNDO === selCnpj && indexAbs !== -1) {
      selCnpjBin.abs[indexAbs] = true;
    }

    // Pct values
    const indexPct = limits.pct.findIndex(
      (limit) => cE["CAPTC_LIQ_PCT_ms"] <= limit
    );
    if (indexPct !== -1) {
      values.pct[indexPct]++;
    }
    if (cE.CNPJ_FUNDO === selCnpj && indexPct !== -1) {
      selCnpjBin.pct[indexPct] = true;
    }
  });
  // End of the counting of values for the histogram

  // Building final data format for absolute values
  const finalDataAbs = xTicks.abs.map((cE, cI) => ({
    xTick: cE,
    value: values.abs[cI],
    limit: limits.abs[cI],
    selCnpjBin: selCnpjBin.abs[cI],
  }));

  // Building final data format for percentual values
  const finalDataPct = xTicks.pct.map((cE, cI) => ({
    xTick: cE,
    value: values.pct[cI],
    limit: limits.pct[cI],
    selCnpjBin: selCnpjBin.pct[cI],
  }));

  const finalData = { abs: finalDataAbs, pct: finalDataPct };

  return finalData;
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

export {
  capitalize,
  pushIfNew,
  getToneColor,
  generateYaxisTicksBasedOnMaxMod,
  generateYaxisDomainBasedOnMaxMod,
  prepareHistogram,
  buildPredKey,
};
