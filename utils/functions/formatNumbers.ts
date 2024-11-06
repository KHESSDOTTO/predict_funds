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

export { formatNumToStrMlnK, formatNumToPctStr };
