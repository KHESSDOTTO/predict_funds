import { describe, it, expect } from "vitest";
import { yAxisTickFormats } from "./netFundingPredChartFunctions";

describe("yAxisTickFormats()", () => {
  it("Should return 'R$1 k' for num 500 and abs", () => {
    expect(yAxisTickFormats(500, "abs")).toBe("R$1 k");
  });
  it("Should return 'R$-1 k' for num -500 and abs", () => {
    expect(yAxisTickFormats(-500, "abs")).toBe("R$-1 k");
  });
  it("Should return 'R$ 0' for num 0 and abs", () => {
    expect(yAxisTickFormats(0, "abs")).toBe("R$ 0");
  });
  it("Should return 'R$2 k' for num 1500 and abs", () => {
    expect(yAxisTickFormats(1500, "abs")).toBe("R$2 k");
  });
  it("Should return 'R$1 mln' for num 1.4 * 10**6 and abs", () => {
    expect(yAxisTickFormats(1.4 * 10 ** 6, "abs")).toBe("R$1 mln");
  });
  it("Should return 'R$-1 mln' for num -1.4 * 10**6 and abs", () => {
    expect(yAxisTickFormats(-1.4 * 10 ** 6, "abs")).toBe("R$-1 mln");
  });
  it("Should return 'R$2 mln' for num 1.5 * 10**6 and abs", () => {
    expect(yAxisTickFormats(1.5 * 10 ** 6, "abs")).toBe("R$2 mln");
  });
  it("Should return 'R$1.4 bln' for num 1.4 * 10**9 and abs", () => {
    expect(yAxisTickFormats(1.4 * 10 ** 9, "abs")).toBe("R$1.4 bln");
  });
  it("Should return 'R$-1.4 bln' for num -1.4 * 10**9 and abs", () => {
    expect(yAxisTickFormats(-1.4 * 10 ** 9, "abs")).toBe("R$-1.4 bln");
  });
  it("Should return 'R$1.8 mln' for num 1.8 * 10**9 and abs", () => {
    expect(yAxisTickFormats(1.8 * 10 ** 9, "abs")).toBe("R$1.8 bln");
  });
  it("Should return '500%' for num 500 and pct", () => {
    expect(yAxisTickFormats(500, "pct")).toBe("500.00%");
  });
  it("Should return '50%' for num 50 and pct", () => {
    expect(yAxisTickFormats(50, "pct")).toBe("50.00%");
  });
  it("Should return '-50%' for num -50 and pct", () => {
    expect(yAxisTickFormats(-50, "pct")).toBe("-50.00%");
  });
  it("Should return '0%' for num 0 and pct", () => {
    expect(yAxisTickFormats(0, "pct")).toBe("0.00%");
  });
  it("Should return '1000000%' for num 10**6 and pct", () => {
    expect(yAxisTickFormats(10 ** 6, "pct")).toBe("1000000.00%");
  });
  it("Should return '-1000000%' for num -1 * 10**6 and pct", () => {
    expect(yAxisTickFormats(-1 * 10 ** 6, "pct")).toBe("-1000000.00%");
  });
  it("Should return '1000000000%' for num 10**9 and pct", () => {
    expect(yAxisTickFormats(10 ** 9, "pct")).toBe("1000000000.00%");
  });
  it("Should return '-1000000000%' for num -1 * 10**9 and pct", () => {
    expect(yAxisTickFormats(-1 * 10 ** 9, "pct")).toBe("-1000000000.00%");
  });
});
