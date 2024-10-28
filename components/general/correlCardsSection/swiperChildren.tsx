import type { CardPropsType } from "@/utils/types";
import Card from "@/components/UI/card";
import { SwiperSlide } from "swiper/react";
import type { SwiperChildrenPropsType } from "./correlCardsSectionTypes";

export default function SwiperChildren({ cE, index }: SwiperChildrenPropsType) {
  const hiddenFields = [
    "_id",
    "CNPJ_FUNDO",
    "janela_em_meses",
    "ancora",
    "data_calc_correlacao",
    "CLASSE_ANBIMA",
    "updated_at",
  ];

  const props: CardPropsType = {
    title: cE[0],
    imgSrc: "",
    correlVal: cE[1],
  };

  if (hiddenFields.includes(cE[0])) {
    return null;
  }

  return (
    <SwiperSlide key={index}>
      <Card {...props} />
    </SwiperSlide>
  );
}
