import Link from "next/link";
import type { MouseEventHandler } from "react";

interface CenariosBtnSectionProps {
  saveCenario: MouseEventHandler<HTMLButtonElement | HTMLDivElement>;
}

export default function CenariosBtnSection({
  saveCenario,
}: CenariosBtnSectionProps) {
  return (
    <div
      id="cenariosBtnSection"
      className="flex flex-wrap gap-2 lg:gap-0 px-4 justify-center items-center lg:w-10/12 lg:pt-2 lg:mt-4 lg:px-0"
    >
      <div className="w-full border-white/90 lg:border-white/20 mb-1 shadow-lg h-2 shadow-white lg:shadow-black lg:border-b-2 lg:mb-0"></div>
      <div className="w-full flex justify-center items-start gap-4 lg:bg-gradient-to-b lg:from-black/50 lg:via-black/40 lg:via-50% lg:pt-[10px] lg:pb-4">
        <button
          onClick={saveCenario}
          className="text-indigo-400 px-1 transition-all duration-300 border-indigo-400 hover:text-indigo-300 lg:hover:border-indigo-500 hover:-translate-y-px"
        >
          + Save Cenario
        </button>
        <Link href={"/loggedin/my_cenarios"} className="lg:right-2">
          <button className="text-red-600 px-1 transition-all duration-200 border-red-500 hover:text-red-500 lg:hover:border-red-700 hover:-translate-y-px">
            Go to Cenarios
          </button>
        </Link>
      </div>
    </div>
  );
}
