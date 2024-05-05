import { RawHistogramData, FinalHistogramData } from "./types";

function generateYaxisTicksBasedOnMaxAbs(
  maxAbs: number,
  maxValueTick = 100000,
  numTicks = 9,
  times = 1
) {
  const ticks: number[] = [];

  console.log("maxAbs");
  console.log(maxAbs);

  if (maxAbs <= maxValueTick || times > 50) {
    // Prevent infinite recursion by limiting times
    const minTick = -maxValueTick;
    const maxTick = maxValueTick;
    const step = (maxTick - minTick) / (numTicks - 1);

    for (let i = 0; i < numTicks; i++) {
      ticks.push(minTick + step * i);
    }

    console.log("ticks");
    console.log(ticks);
    return ticks;
  }

  let newMaxValueTick = maxValueTick;
  if (times == 1) newMaxValueTick = 200000;
  else if (times == 2) newMaxValueTick = 500000;
  else newMaxValueTick += 500000;

  return generateYaxisTicksBasedOnMaxAbs(
    maxAbs,
    newMaxValueTick,
    numTicks,
    times + 1
  );
}

function generateYaxisDomainBasedOnMaxAbs(
  maxAbs: number,
  maxValueTick = 100000,
  times = 1
) {
  if (maxAbs <= maxValueTick || times > 50) {
    // Prevent infinite recursion
    const minTick = -maxValueTick;
    const maxTick = maxValueTick;

    const domain = [minTick, maxTick];
    return domain;
  }

  // Adjust newMaxValueTick based on the current attempt (times)
  let newMaxValueTick = maxValueTick;
  if (times == 1) newMaxValueTick = 200000;
  else if (times == 2) newMaxValueTick = 500000;
  else newMaxValueTick += 500000; // Simplify the logic for increasing maxValueTick

  return generateYaxisDomainBasedOnMaxAbs(maxAbs, newMaxValueTick, times + 1);
}

function prepareHistogram(
  histogramData: RawHistogramData[],
  numBars: number,
  currCnpj: string
): FinalHistogramData[] | false {
  if (!histogramData || histogramData.length === 0) return false; // Won't run if there is no histogramData or lenght of array = 0

  let step: number;
  let cVal: number;
  const limits: number[] = [];
  const xTicks: string[] = [];
  const values: number[] = [];

  const minVal = histogramData.reduce((min, cE) => {
    return cE.CAPTC_LIQ < min ? cE.CAPTC_LIQ : min;
  }, histogramData[0]["CAPTC_LIQ"]);

  const maxVal = histogramData.reduce((max, cE) => {
    return cE.CAPTC_LIQ > max ? cE.CAPTC_LIQ : max;
  }, histogramData[0]["CAPTC_LIQ"]);

  console.log("maxVal");
  console.log(maxVal);
  console.log("minVal");
  console.log(minVal);

  step = (maxVal - minVal) / numBars;
  cVal = minVal;

  console.log("maxVal");
  console.log(maxVal);
  console.log("minVal");
  console.log(minVal);
  console.log("step");
  console.log(step);

  // Defining values for limits and xTicks arrays
  for (let i = 0; i < numBars; i++) {
    const lowerEnd = cVal;
    const separator = " - ";
    const upperEnd = cVal + step;
    const tick =
      formatNumberToStringK(lowerEnd, false) +
      separator +
      formatNumberToStringK(upperEnd, i === numBars - 1); // If it is the last limit, than roundUp (true)
    xTicks.push(tick);
    limits.push(upperEnd); // No rounding on this array to count the elements in each interval of values
    values.push(0);
    cVal = upperEnd;
  }
  // End of limits and xTicks arrays

  // Count elements on each interval of values to be the Yaxis values (based on 'limits' array)
  histogramData.forEach((cE) => {
    const index = limits.findIndex((limit) => cE.CAPTC_LIQ <= limit);
    if (index !== -1) values[index]++;
  });
  // End of the counting of values for the histogram

  const finalData = xTicks.map((cE, cI) => ({
    xTick: cE,
    value: values[cI],
    limit: limits[cI],
    currCnpjBin: 0,
  }));

  return finalData;
}

function formatNumberToStringK(
  number: number,
  roundUp: boolean = false
): string {
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

export {
  generateYaxisTicksBasedOnMaxAbs,
  generateYaxisDomainBasedOnMaxAbs,
  prepareHistogram,
};
