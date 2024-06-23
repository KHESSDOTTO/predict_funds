import Image from "next/image";

interface nameValFormat {
  name: string;
  value: number;
}

interface CardProps {
  title: string;
  imgSrc: string;
  nameValsArr: nameValFormat[];
}

export default function Card({ title, imgSrc, nameValsArr }: CardProps) {
  const withImg = imgSrc;

  return (
    <article className="w-full rounded-lg border border-white py-8 px-10 shadow-no-offset-white-soft flex flex-col justify-between gap-8 items-center lg:min-w-72 lg:w-fit">
      <h1 className="border-b-2 border-red-700 text-white pb-2 w-full">
        {title}
      </h1>
      <div className="flex flex-col justify-start items-start gap-8 w-full lg:w-full lg:flex-row">
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
            <div className="w-full px-12 py-4 pb-4 border border-white border-l-8 border-t-gray-500 border-b-gray-500 border-l-blue-custom-light rounded-lg box-shadow-no-offset-white">
              <div className="relative right-2">{name}</div>
              <div className="relative right-2 text-[34px]">{formattedNum}</div>
            </div>
          );
        })}
      </div>
    </article>
  );
}
