import type { AbsOrPctPredsViewFormPropsType } from "../netFundingPredChartTypes";

export default function AbsOrPctPredsViewForm({
  handleAbsOrPctChange,
  absOrPct,
  setAbsOrPct,
  setAbsOrPctShort,
}: AbsOrPctPredsViewFormPropsType) {
  return (
    <form className="flex gap-2 left-24 md:gap-8 lg:absolute">
      <h4 className="mr-2 md:mr-6">Visualization: </h4>
      <div className="flex text-xs items-center gap-1 md:text-sm">
        <input
          type="radio"
          name="absOrPct"
          id="inpAbsOrPctABS"
          value={"CAPTC_LIQ_ABS_ms"}
          onChange={(e) =>
            handleAbsOrPctChange({ e, setAbsOrPct, setAbsOrPctShort })
          }
          checked={absOrPct === "CAPTC_LIQ_ABS_ms"}
        />
        <label htmlFor="monthsCorrel6">Absolute values</label>
      </div>
      <div className="flex items-center gap-1 text-xs md:text-sm">
        <input
          type="radio"
          name="absOrPct"
          id="inpAbsOrPctPCT"
          value={"CAPTC_LIQ_PCT_ms"}
          onChange={(e) =>
            handleAbsOrPctChange({ e, setAbsOrPct, setAbsOrPctShort })
          }
          checked={absOrPct === "CAPTC_LIQ_PCT_ms"}
        />
        <label>Percentage of Net Asset</label>
      </div>
    </form>
  );
}
