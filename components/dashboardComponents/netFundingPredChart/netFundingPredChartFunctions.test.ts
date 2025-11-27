import { describe, it } from 'vitest';

describe("yAxisTickFormats()", () => {
    it("Should return 'R$500' for num 500 and abs", () => {})
    it("Should return 'R$-500' for num -500 and abs", () => {})
    it("Should return 'R$ 0' for num 0 and abs", () => {});
    it("Should return 'R$1500' for num 1500 and abs", () => {});
    it("Should return 'R$1 mln' for num 1.4 * 10**6 and abs", () => {});
    it("Should return 'R$-1 mln' for num -1.4 * 10**6 and abs", () => {});
    it("Should return 'R$2 mln' for num 1.5 * 10**6 and abs", () => {});
    it("Should return 'R$1.4 bln' for num 1.4 * 10**9 and abs", () => {});
    it("Should return 'R$-1.4 bln' for num -1.4 * 10**9 and abs", () => {});
    it("Should return 'R$1.8 mln' for num 1.8 * 10**9 and abs", () => {});
    it("Should return '500%' for num 500 and pct", () => {});
    it("Should return '50%' for num 50 and pct", () => {});
    it("Should return '-50%' for num -50 and pct", () => {});
    it("Should return '0%' for num 0 and pct", () => {});
    it("Should return '1000000%' for num 10**6 and pct", () => {});
    it("Should return '-1000000%' for num -1 * 10**6 and pct", () => {});
    it("Should return '1000000000%' for num 10**9 and pct", () => {});
    it("Should return '-1000000000%' for num -1 * 10**9 and pct", () => {});
});
