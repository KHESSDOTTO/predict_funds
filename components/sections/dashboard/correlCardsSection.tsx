import React from "react";
import Card from "@/components/UI/card";
import type { CardPropsType } from "@/utils/types";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

interface CorrelCardsSectionProps {
  padding: string;
  gap: string;
  correlArr: CardPropsType[];
}

export default function CorrelCardsSection({
  padding,
  gap,
  correlArr,
}: CorrelCardsSectionProps) {
  const h1Class =
    "mt-4 text-lg mx-[16vw] text-white/90 p-2 border-white/90 font-semibold text-center border-b lg:pb-2 lg:indent-2 lg:text-left lg:w-[97vw]";
  const topWrapperClass = `flex flex-col w-full gap-${gap} py-8 px-[10px] lg:flex-row lg:justify-center lg:flex-wrap lg:p-${padding}`;
  const cardWrapperStyle = {};
  const tippyContent =
    "This section refers to the correlation between the returns on the benchmarks, given the same initial investment over the course of 12 months.";

  return (
    <div>
      <h1 className={h1Class}>
        Quota - Correlations
        <Tippy content={tippyContent}>
          <span className="ml-2 cursor-pointer text-blue-600 font-bold text-base">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6 inline relative bottom-[2px]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
              />
            </svg>
          </span>
        </Tippy>
      </h1>
      <section className={topWrapperClass}>
        {correlArr.map((cE, index) => {
          const { title, imgSrc, nameValsArr } = cE;
          return (
            <div key={index} style={cardWrapperStyle}>
              <Card title={title} imgSrc={imgSrc} nameValsArr={nameValsArr} />
            </div>
          );
        })}
      </section>
    </div>
  );
}
