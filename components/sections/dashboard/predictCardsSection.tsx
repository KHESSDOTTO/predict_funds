import { HistoricType } from "@/utils/types";
import PredictCard from "../../UI/predictCard";

interface PredictCardsSectionProps {
  data: HistoricType[];
}

export default function PredictCardsSection({
  data,
}: PredictCardsSectionProps) {
  return (
    <div className="pt-4 flex flex-col items-center col-span-12 lg:grid-rows-1 lg:grid-cols-12 lg:grid lg:pt-0 lg:pb-4">
      <div className="flex justify-center items-center col-span-3">
        <p className="font-bold inline underline text-2xl px-4">
          Expectations:
        </p>
      </div>
      <div className="my-4 col-span-9 flex flex-col items-center justify-around md:flex-row md:flex-wrap lg:flex-nowrap">
        <PredictCard time={"Week"} data={data} />
        <PredictCard time={"Month"} data={data} />
        <PredictCard time={"Three Months"} data={data} />
      </div>
    </div>
  );
}
