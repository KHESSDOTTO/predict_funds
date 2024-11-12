import { useState } from "react";
import type { VisualizationFormPropsType } from "../netFundingHistogramChartTypes";
import DualRangeSliderWithTippy from "./filterForm";

export default function VisualizationForm({
  absOrPct,
  setAbsOrPct,
}: VisualizationFormPropsType) {
  
  return (
    <form className="flex items-center gap-2 md:gap-8">
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
        <label className="whitespace-nowrap">Absolute values</label>
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
        <label className="whitespace-nowrap">Percentage of Net Asset</label>
      </div>
    </form>
  );
}
