import type { AbsOrPctPredsViewFormPropsType } from "../netFundingPredChartTypes";

export default function AbsOrPctPredsViewForm({
  handleAbsOrPctChange,
  absOrPct,
  setAbsOrPct,
  setAbsOrPctShort,
}: AbsOrPctPredsViewFormPropsType) {
  return (
    <form className="flex flex-1 lg:gap-8">
      <h4 className="mr-6">Visualization: </h4>
      <div className="flex gap-x-4 gap-y-2 flex-wrap">
        <div className="flex text-xs items-center gap-1 md:text-sm">
          <input
            type="radio"
            className="cursor-pointer"
            name="absOrPct"
            id="inpAbsOrPctABS"
            value={"CAPTC_LIQ_ABS_ms"}
            onChange={(e) =>
              handleAbsOrPctChange({ e, setAbsOrPct, setAbsOrPctShort })
            }
            checked={absOrPct === "CAPTC_LIQ_ABS_ms"}
          />
          <label htmlFor="monthsCorrel6" className="whitespace-nowrap">
            Absolute values
          </label>
        </div>
        <div className="flex items-center gap-1 text-xs md:text-sm">
          <input
            type="radio"
            className="cursor-pointer"
            name="absOrPct"
            id="inpAbsOrPctPCT"
            value={"CAPTC_LIQ_PCT_ms"}
            onChange={(e) =>
              handleAbsOrPctChange({ e, setAbsOrPct, setAbsOrPctShort })
            }
            checked={absOrPct === "CAPTC_LIQ_PCT_ms"}
          />
          <label className="whitespace-nowrap">Percentage of Net Asset</label>
        </div>
      </div>
    </form>
  );
}
