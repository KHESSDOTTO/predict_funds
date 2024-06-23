import { CardProps } from "@/utils/types";
import Image from "next/image";

export default function Card({ title, imgSrc, nameValsArr }: CardProps) {
  const withImg = imgSrc;

  return (
    <article className="w-full rounded-lg border border-white/90 py-6 px-8 flex flex-col justify-between gap-6 items-center lg:min-w-80">
      <h1 className="border-b-2 border-red-700 text-white pb-2 w-full">
        {title}
      </h1>
      <div className="flex flex-col justify-start items-start w-full lg:w-full lg:flex-row">
        {withImg && (
          <div>
            <Image src={imgSrc} alt="Symbol" width={85} height={85} />
          </div>
        )}
        {nameValsArr.map((cE) => {
          const name = cE.name;
          const value = cE.value;
          const strPctNumber = (value * 100).toFixed(1);
          const formattedNum = strPctNumber.concat("%");
          return (
            <div className="flex flex-col w-full px-10 py-4 border border-gray-500 border-r-white border-l-8 border-l-blue-custom-light rounded-lg box-shadow-no-offset-white gap-2">
              <div className="relative right-2 text-[0.9em]">{name}</div>
              <div className="relative right-2 mb-1 text-[26px]">
                {formattedNum}
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
}

export type { CardProps };
