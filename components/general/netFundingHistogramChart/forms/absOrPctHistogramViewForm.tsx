import type { AbsOrPctHistogramViewFormPropsType } from "../netFundingHistogramChartTypes";

export default function AbsOrPctHistogramViewForm({
  absOrPct,
  setAbsOrPct,
}: AbsOrPctHistogramViewFormPropsType) {
  return (
    <form className="flex gap-2 left-24 md:gap-8 lg:absolute">
      <h4 className="mr-2 md:mr-6">Visualization: </h4>
      <div className="flex text-xs items-center gap-1 md:text-sm">
        <input
          type="radio"
          name="absOrPct"
          id="inpAbsOrPctABS"
          value={"abs"}
          onChange={(e) => setAbsOrPct(e.target.value as "abs" | "pct")}
          checked={absOrPct === "abs"}
        />
        <label htmlFor="monthsCorrel6">Absolute values</label>
      </div>
      <div className="flex items-center gap-1 text-xs md:text-sm">
        <input
          type="radio"
          name="absOrPct"
          id="inpAbsOrPctPCT"
          value={"pct"}
          onChange={(e) => setAbsOrPct(e.target.value as "abs" | "pct")}
          checked={absOrPct === "pct"}
        />
        <label>Percentage of Net Asset</label>
      </div>
    </form>
  );
}
