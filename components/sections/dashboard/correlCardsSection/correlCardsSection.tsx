import React, { useEffect, useState } from "react";
import Card from "@/components/UI/card";
import type { CardPropsType } from "@/utils/types";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import SwiperCore from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import styles from "./correlCardsSection.module.css";
import { ClipLoader } from "react-spinners";

SwiperCore.use([Navigation]);

interface CorrelCardsSectionProps {
  padding: string;
  correls: any[];
}

export default function CorrelCardsSection({
  padding,
  correls,
}: CorrelCardsSectionProps) {
  const h2Class =
    "mt-4 text-lg mx-[16vw] text-white/90 p-2 border-white/90 font-semibold text-center border-b lg:m-4 lg:pb-2 lg:text-left";
  const tippyContent =
    "This section refers to the correlation between the returns on the benchmarks, given the same initial investment over the course of 6 or 12 months, as choosen below.";

  const [isLoadingCorrels, setIsLoadingCorrels] = useState(true);
  const [selCorrels, setSelCorrels] = useState<any>([]);
  const [numMonths, setNumMonths] = useState(6);

  function handleNumMonthsChange(e: React.ChangeEvent<HTMLInputElement>) {
    setNumMonths(Number(e.target.value));
  }

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

  // Definindo classes CSS para o contêiner superior
  const topWrapperClass = `w-full flex justify-center items-center py-8 px-4`;

  return (
    <div>
      <h2 className={h2Class}>
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
          <form className="flex gap-2 left-24 md:gap-8 lg:absolute">
            <h4 className="mr-2 md:mr-6">Correlation period: </h4>
            <div className="flex text-xs items-center gap-1 md:text-sm">
              <input
                type="radio"
                name="monthsCorrel"
                id="monthsCorrel6"
                value={6}
                onChange={handleNumMonthsChange}
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
                onChange={handleNumMonthsChange}
                checked={numMonths === 12}
              />
              <label>12 months</label>
            </div>
          </form>
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
              className={topWrapperClass}
              slidesPerGroup={1}
              loop={true}
              navigation={{
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
              }}
              speed={600}
              style={{ width: "80%", height: "auto" }}
              breakpoints={{
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
              }}
            >
              {selCorrels.map((cE: any[], index: number) => {
                const hiddenFields = [
                  "_id",
                  "CNPJ_FUNDO",
                  "janela_em_meses",
                  "ancora",
                  "data_calc_correlacao",
                  "CLASSE_ANBIMA",
                ];

                const props: CardPropsType = {
                  title: cE[0],
                  imgSrc: "",
                  correlVal: cE[1],
                };

                if (hiddenFields.includes(cE[0])) {
                  return <></>;
                }

                return (
                  <SwiperSlide key={index}>
                    <Card {...props} />
                  </SwiperSlide>
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
