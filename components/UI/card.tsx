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
  const noPropsPassed = !title && !imgSrc && !nameValsArr;
  if (noPropsPassed) {
    title = "IBOV";
    imgSrc =
      "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4w…wNjYsMTU1LjMzOSwyMzEuMDY2eiIvPgo8L2c+Cjwvc3ZnPg==";
    nameValsArr = [{ name: "Correl.", value: 0.35 }];
  }

  return (
    <div className="rounded-lg border border-white p-8 box-shadow-white-soft flex flex-col justify-between gap-8 items-center w-fit">
      <h1 className="border-b-2 border-red-700 text-white pb-2 w-full">
        {title}
      </h1>
      <div className="flex flex-col justify-start items-start gap-8 w-full lg:flex-row">
        <div>
          <Image src={imgSrc} alt="Symbol" width={85} height={85} />
        </div>
        {nameValsArr.map((cE) => {
          return (
            <div className="px-10 py-4 pb-4 border border-white border-l-8 border-t-gray-200 border-b-gray-200 border-l-blue-custom-light">
              <div>{cE.name}</div>
              <div className="text-[36px]">{cE.value}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
