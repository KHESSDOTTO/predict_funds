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
import type { CardPropsType } from "@/utils/types/generalTypes/types";
import Card from "@/components/UI/card/card";
import { SwiperSlide } from "swiper/react";
import TitleComponent from "@/components/UI/titleComponent";
import ButtonGreen from "@/components/UI/buttonGreen";
import { exportCorrels } from "./correlCardsSectionFunctions";
import { useControlForm } from "@/contexts/controlFormContext";
import { useUser } from "@/contexts/userContext";
import { track } from "@vercel/analytics";

export default function CorrelCardsSection({
  correls,
}: CorrelCardsSectionProps) {
  const { user } = useUser();
  const tippyContent =
    "This section refers to the correlation between the returns on the benchmarks, given the same initial investment over the course of 6 or 12 months, as choosen below.";
  const [isLoadingCorrels, setIsLoadingCorrels] = useState(true);
  const [selCorrels, setSelCorrels] = useState<any>([]);
  const [numMonths, setNumMonths] = useState(6);
  const { controlForm } = useControlForm();
  const breakpoints = {
    320: {
      slidesPerView: 1,
      spaceBetween: 10,
    },
    992: {
      slidesPerView: 3,
      spaceBetween: 10,
    },
    1200: {
      slidesPerView: 3,
      spaceBetween: 10,
    },
  };
  const hiddenFields = [
    "_id",
    "CNPJ_FUNDO",
    "janela_em_meses",
    "ancora",
    "data_calc_correlacao",
    "Classificacao",
    "updated_at",
  ];

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
      <div className="flex justify-center lg:block lg:w-full">
        <TitleComponent>
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
        </TitleComponent>
      </div>
      <section className="relative w-full py-2 mb-8 lg:mb-2">
        <div className="text-sm text-gray-200 mb-4 flex relative justify-center lg:py-4 lg:text-base">
          <CorrelCardsForm numMonths={numMonths} setNumMonths={setNumMonths} />
          <div
            className="hidden lg:block absolute right-0 scale-90 top-0"
            onClick={() => {
              track("export_cards_correls", {
                username: user?.username || null,
              });

              if (controlForm && correls) {
                exportCorrels({ selCnpj: controlForm.buscaCnpj, correls });
              }
            }}
          >
            <ButtonGreen shadowColor="white/30" shadowSize="md">
              Export
            </ButtonGreen>
          </div>
        </div>
        {isLoadingCorrels ? (
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
        ) : (
          <>
            <Swiper
              modules={[Navigation]}
              loop={true}
              navigation={{
                nextEl: `.swiper-button-prev.${styles.swiperButtonNext}`,
                prevEl: `.swiper-button-next.${styles.swiperButtonPrev}`,
              }}
              speed={600}
              style={{ width: "95%", height: "auto" }}
              breakpoints={breakpoints}
            >
              {selCorrels.map((cE: any[], index: number) => {
                const props: CardPropsType = {
                  title: cE[0],
                  imgSrc: "",
                  correlVal: cE[1],
                };

                if (hiddenFields.includes(cE[0])) {
                  return null;
                }

                return (
                  <SwiperSlide key={index} className="px-4 py-2">
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
            <div
              className="lg:hidden absolute right-[50%] bottom-0 translate-x-[50%] translate-y-full"
              onClick={() =>
                controlForm && correls
                  ? exportCorrels({ selCnpj: controlForm.buscaCnpj, correls })
                  : {}
              }
            >
              <ButtonGreen shadowColor="white/30" shadowSize="md">
                Export
              </ButtonGreen>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
