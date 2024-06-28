import Card from "@/components/UI/card";
import type { CardPropsType } from "@/utils/types";

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
    "w-[97vw] mt-4 text-lg mx-[32vw] text-white/90 border-white/90 font-semibold text-center border-b lg:pb-2 lg:indent-2 lg:text-left";
  const topWrapperClass = `flex flex-col w-full gap-${gap} p-8 lg:flex-row lg:justify-center lg:flex-wrap lg:p-${padding}`;
  const cardWrapperStyle = {};

  return (
    <>
      <h1 className={h1Class}>Quota - Correlations</h1>
      <section className={topWrapperClass}>
        {correlArr.map((cE) => {
          const title = cE.title,
            imgSrc = cE.imgSrc,
            nameValsArr = cE.nameValsArr;
          return (
            <div style={cardWrapperStyle}>
              <Card
                title={title}
                //   imgSrc="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIFVwbG9hZGVkIHRvOiBTVkcgUmVwbywgd3d3LnN2Z3JlcG8uY29tLCBHZW5lcmF0b3I6IFNWRyBSZXBvIE1peGVyIFRvb2xzIC0tPgo8c3ZnIGhlaWdodD0iODVweCIgd2lkdGg9Ijg1cHgiIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIAoJIHZpZXdCb3g9IjAgMCAzMTAuNjc5IDMxMC42NzkiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8Zz4KCTxwYXRoIHN0eWxlPSJmaWxsOiMwMDk2Mzg7IiBkPSJNMTkzLjIwOCwyMjAuOTNsMzkuODExLDY4Ljk1NmM0Ni40MjQtMjYuODYxLDc3LjY2LTc3LjA1NCw3Ny42Ni0xMzQuNTQ2aC03OS42MTIKCQlDMjMxLjA2NiwxODMuMzY3LDIxNS44NCwyMDcuODM2LDE5My4yMDgsMjIwLjkzeiIvPgoJPHBhdGggc3R5bGU9ImZpbGw6I0ZGNkQ2ODsiIGQ9Ik0xNTUuMzM5LDc5LjYxNGMxMy43OTcsMCwyNi43MjgsMy42OTEsMzcuODY5LDEwLjEzNmwzOS44MTEtNjguOTU2CgkJQzIxMC4xNjgsNy41NzMsMTgzLjYzOCwwLjAwMSwxNTUuMzM4LDAuMDAxYy0yOC4yOTksMC01NC44MjgsNy41NzEtNzcuNjc5LDIwLjc5MmwzOS44MTIsNjguOTU2CgkJQzEyOC42MTEsODMuMzA1LDE0MS41NDQsNzkuNjE0LDE1NS4zMzksNzkuNjE0eiIvPgoJPHBhdGggc3R5bGU9ImZpbGw6I0ZGQzg0MzsiIGQ9Ik0yMzMuMDE5LDIwLjc5NEwxOTMuMjA4LDg5Ljc1YzIyLjYzMSwxMy4wOTUsMzcuODU4LDM3LjU2MywzNy44NTgsNjUuNTkxaDc5LjYxMgoJCUMzMTAuNjc5LDk3Ljg0OCwyNzkuNDQyLDQ3LjY1NSwyMzMuMDE5LDIwLjc5NHoiLz4KCTxwYXRoIHN0eWxlPSJmaWxsOiNCRjUzNEY7IiBkPSJNMTE3LjQ3MSw4OS43NUw3Ny42NTksMjAuNzk0QzMxLjIzNSw0Ny42NTUsMCw5Ny44NDgsMCwxNTUuMzRoNzkuNjEyCgkJQzc5LjYxMiwxMjcuMzEzLDk0Ljg0LDEwMi44NDQsMTE3LjQ3MSw4OS43NXoiLz4KCTxwYXRoIHN0eWxlPSJmaWxsOiMwMDcxQ0U7IiBkPSJNNzkuNjEyLDE1NS4zNEgwYzAsNTcuNDkyLDMxLjIzNSwxMDcuNjg1LDc3LjY1OCwxMzQuNTQ1bDM5LjgxMi02OC45NTYKCQlDOTQuODM5LDIwNy44MzUsNzkuNjEyLDE4My4zNjcsNzkuNjEyLDE1NS4zNHoiLz4KCTxwYXRoIHN0eWxlPSJmaWxsOiM1RTk2REM7IiBkPSJNMTU1LjMzOSwyMzEuMDY2Yy0xMy43OTYsMC0yNi43MjktMy42OTEtMzcuODY5LTEwLjEzN2wtMzkuODEyLDY4Ljk1NgoJCWMyMi44NTIsMTMuMjIyLDQ5LjM4MSwyMC43OTMsNzcuNjgsMjAuNzkzYzI4LjMsMCw1NC44MzEtNy41NzEsNzcuNjgtMjAuNzkzbC0zOS44MTEtNjguOTU2CgkJQzE4Mi4wNjgsMjI3LjM3NiwxNjkuMTM2LDIzMS4wNjYsMTU1LjMzOSwyMzEuMDY2eiIvPgo8L2c+Cjwvc3ZnPg=="
                imgSrc={imgSrc}
                nameValsArr={nameValsArr}
              />
            </div>
          );
        })}
      </section>
    </>
  );
}
