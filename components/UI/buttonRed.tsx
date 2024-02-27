import { ButtonPropsType } from "@/utils/types";

function ButtonRed(props: ButtonPropsType) {
  const style = `font-serif py-1 px-4 rounded-md bg-gradient-to-t from-red-800 to-red-500 text-white border-red-800 transition-all shadow-md shadow-${props.shadowColor} hover:text-yellow-300/90 hover:-translate-y-px`;
  return <button className={style}>{props.children}</button>;
}

export default ButtonRed;
