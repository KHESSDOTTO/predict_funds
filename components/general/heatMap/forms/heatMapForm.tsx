import { HeatMapFormPropsType } from "./heatMapFormTypes";

export default function HeatMapForm({
  numMonths,
  setNumMonths,
}: HeatMapFormPropsType) {
  return (
    <form className="flex gap-2 left-24 md:gap-8 lg:absolute">
      <h4 className="mr-2 md:mr-6">Correlation period: </h4>
      <div className="flex text-xs items-center gap-1 md:text-sm">
        <input
          type="radio"
          name="monthsCorrel"
          id="monthsCorrel6"
          value={6}
          onChange={(e) => setNumMonths(Number(e.target.value))}
          checked={numMonths === 6}
        />
        <label htmlFor="monthsCorrel6">6 months</label>
      </div>
      <div className="flex items-center gap-1 text-xs md:text-sm">
        <input
          type="radio"
          name="monthsCorrel"
          id="monthsCorrel12"
          value={12}
          onChange={(e) => setNumMonths(Number(e.target.value))}
          checked={numMonths === 12}
        />
        <label htmlFor="monthsCorrel12">12 months</label>
      </div>
    </form>
  );
}
