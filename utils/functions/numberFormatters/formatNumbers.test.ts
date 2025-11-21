import { describe, it, expect } from "vitest";
import { formatNumToPctStr, formatNumToStrMlnK } from "./formatNumbers";

describe("formatNumToStrMlnK()", () => {
  it('Should return "1 k" for number 1000 and roundup false', () => {
    expect(formatNumToStrMlnK(1000, false)).toBe("1 k");
  });

  it('Should return "1 k" for number 1300 and roundup false', () => {
    expect(formatNumToStrMlnK(1300, false)).toBe("1 k");
  });

  it('Should return "2 k" for number 1300 and roundup true', () => {
    expect(formatNumToStrMlnK(1300, true)).toBe("2 k");
  });

  it('Should return "2 k" for number 1500 and roundup false', () => {
    expect(formatNumToStrMlnK(1500, false)).toBe("2 k");
  });

  it('Should return "2 k" for number 1800 and roundup false', () => {
    expect(formatNumToStrMlnK(1800, false)).toBe("2 k");
  });

  it('Should return "300" for number 300 and roundup false', () => {
    expect(formatNumToStrMlnK(300, false)).toBe("300");
  });

  it('Should return "1 mln" for number 10^6 and roundup false', () => {
    expect(formatNumToStrMlnK(10 ** 6, false)).toBe("1 mln");
  });

  it('Should return "1.1 mln" for number 1.08 * 10^6 and roundup false', () => {
    expect(formatNumToStrMlnK(1.08 * 10 ** 6, false)).toBe("1.1 mln");
  });

  it('Should return "1 mln" for number 1.03 * 10^6 and roundup false', () => {
    expect(formatNumToStrMlnK(1.03 * 10 ** 6, false)).toBe("1 mln");
  });

  it('Should return "(2 k)" for number -1600 and roundup false', () => {
    expect(formatNumToStrMlnK(-1600, false)).toBe("(2 k)");
  });

  it('Should return "(300)" for number -300 and roundup false', () => {
    expect(formatNumToStrMlnK(-300, false)).toBe("(300)");
  });

  it('Should return "(1 mln)" for number (-1 * 10^6) and roundup false', () => {
    expect(formatNumToStrMlnK(-1 * 10 ** 6, false)).toBe("(1 mln)");
  });

  it('Should return "(1.1 mln)" for number (-1.05 * 10^6) and roundup false', () => {
    expect(formatNumToStrMlnK(-1.05 * 10 ** 6, false)).toBe("(1.1 mln)");
  });

  it('Should return "(1 mln)" for number (-1.03 * 10^6) and roundup false', () => {
    expect(formatNumToStrMlnK(-1.03 * 10 ** 6, false)).toBe("(1 mln)");
  });

  it('Should return "(1.1 mln)" for number (-1.03 * 10^6) and roundup true', () => {
    expect(formatNumToStrMlnK(-1.03 * 10 ** 6, true)).toBe("(1.1 mln)");
  });
});

// describe("formatNumToPctStr()", () => {});
