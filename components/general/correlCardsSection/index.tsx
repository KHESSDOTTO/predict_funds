import React, { useEffect, useState } from "react";
import CorrelCardsForm from "./forms/correlCardsForm";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { ClipLoader } from "react-spinners";
import SwiperCore from "swiper";
import { Swiper } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import styles from "./correlCardsSection.module.css";
import type { CorrelCardsSectionProps } from "./correlCardsSectionTypes";
import SwiperChildren from "./swiperChildren";

SwiperCore.use([Navigation]);

export default function CorrelCardsSection({
  padding,
  correls,
}: CorrelCardsSectionProps) {
  const tippyContent =
    "This section refers to the correlation between the returns on the benchmarks, given the same initial investment over the course of 6 or 12 months, as choosen below.";
  const [isLoadingCorrels, setIsLoadingCorrels] = useState(true);
  const [selCorrels, setSelCorrels] = useState<any>([]);
  const [numMonths, setNumMonths] = useState(6);
  const breakpoints = {
    320: {
      slidesPerView: 1,
      spaceBetween: 20,
    },
    992: {
      slidesPerView: 2,
      spaceBetween: 30,
    },
    1200: {
      slidesPerView: 3,
      spaceBetween: 30,
    },
  };

  useEffect(() => {
    if (correls) {
      const newSelCorrel = correls.filter((cE) => {
        let result = false;
        cE.forEach((cE2: any[]) => {
          if (cE2[0] === "janela_em_meses" && Number(cE2[1]) === numMonths) {
            result = true;
          }
        });
        return result;
      });

      if (newSelCorrel.length === 1) {
        setSelCorrels(newSelCorrel[0]);
        setIsLoadingCorrels(false);
      }
    } else {
      setIsLoadingCorrels(true);
    }
  }, [correls, numMonths]);

  return (
    <div>
      <h2 className="text-lg mx-[16vw] text-white/90 p-2 border-white/90 font-semibold text-center border-b lg:m-4 lg:pb-2 lg:text-left">
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
      </h2>
      <section className="relative w-screen" style={{ padding: padding }}>
        <div className="text-sm text-gray-200 py-6 flex relative justify-center lg:mb-6 lg:pt-4 lg:text-base">
          <CorrelCardsForm numMonths={numMonths} setNumMonths={setNumMonths} />
        </div>
        {isLoadingCorrels && (
          <div className="flex justify-center items-center">
            <ClipLoader
              color={"white"}
              loading={isLoadingCorrels}
              size={50}
              aria-label="Loading Spinner"
              data-testid="loader"
              className="my-4"
              speedMultiplier={0.75}
            />
          </div>
        )}
        {!isLoadingCorrels && (
          <>
            <Swiper
              className={"w-full flex justify-center items-center py-8 px-4"}
              slidesPerGroup={1}
              loop={true}
              navigation={{
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
              }}
              speed={600}
              style={{ width: "80%", height: "auto" }}
              breakpoints={breakpoints}
            >
              {selCorrels.map((cE: any[], index: number) => {
                return (
                  <>
                    <SwiperChildren cE={cE} index={index} />
                  </>
                );
              })}
            </Swiper>
            <div
              className={`swiper-button-prev ${styles.swiperButtonPrev}`}
            ></div>
            <div
              className={`swiper-button-next ${styles.swiperButtonNext}`}
            ></div>
          </>
        )}
      </section>
    </div>
  );
}
