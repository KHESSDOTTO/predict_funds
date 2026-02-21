/**
 * Return string based on number following the pattern:
 * if 10^3 <= mod(x) < 10^6, return rounded whole number with sufix " k";
 * if mod(x) < 10^3, return rounded number formatted as string
 * if 10^6 <= mod(x), return rounded to 1 decimal place number sufixed " mln"
 * if x < 0, also return number between parentesis "(<num>)"
 * Param roundUp makes every rounding be rounded up.
 * @param number the number to be formatted
 * @param roundUp whether or not to always round numbers up
 * @returns string containing the string correspondence of the number passed
 */
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
    roundedNum = Math.round(num);
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

/**
 * Ads parenthesis to number if negative, ads % simbol at the end. Converts number to string.
 * @param number number to be formatted
 * @param decimalPlaces number of decimal places desired for rounding
 * @returns the string correspondence of the number given the passed arguments
 */
function formatNumToPctStr(number: number, decimalPlaces: number) {
  return number < 0
    ? "(" + Math.abs(number).toFixed(decimalPlaces) + "%" + ")"
    : number.toFixed(decimalPlaces) + "%";
}

export { formatNumToStrMlnK, formatNumToPctStr };
