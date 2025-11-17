import { CardPropsType } from "@/utils/types/generalTypes/types";
import Image from "next/image";
import Helpers from "@/utils/functions/helpers";
import { toneColorsMapTxtRGBDarker } from "@/utils/toneColors";
import { mapTickers } from "@/utils/mapTickersCorrels";
import { useRef } from "react";
import { handleHovering, handleHoveringStops } from "./cardHandlers";

export default function Card({ title, imgSrc, correlVal }: CardPropsType) {
  const withImg = imgSrc;
  const adjustTitle = mapTickers[title] ? mapTickers[title] : title;
  const innerContainer = useRef<HTMLDivElement>(null);
  const color = Helpers.getToneColor(
    Number(correlVal),
    toneColorsMapTxtRGBDarker,
    1
  );

  return (
    <article
      className="w-full transition-all hover:scale-[105%] rounded-lg border border-white py-6 px-8 flex flex-col justify-between gap-6 items-center lg:min-w-72"
      onMouseEnter={() => handleHovering(innerContainer)}
      onMouseLeave={() => handleHoveringStops(innerContainer)}
    >
      <h4 className="border-b-2 border-gray-400 text-white pb-2 w-full">
        {adjustTitle}
      </h4>
      <div className="flex flex-col justify-start items-start w-full lg:w-full lg:flex-row">
        {withImg && (
          <div>
            <Image src={imgSrc} alt="Symbol" width={85} height={85} />
          </div>
        )}
        <div
          ref={innerContainer}
          className="flex transition-all duration-300 flex-col w-full px-10 py-4 border border-gray-500 border-r-white border-l-8 border-l-blue-custom-light rounded-lg box-shadow-no-offset-white gap-2"
        >
          <div className="relative right-2 text-[0.9em]">Correl.</div>
          <div
            className="relative right-2 mb-1 text-[24px]"
            style={{ color: color ? color : "white" }}
          >
            {Number(correlVal).toFixed(2)}
          </div>
        </div>
      </div>
    </article>
  );
}
