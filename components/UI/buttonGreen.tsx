import { ButtonPropsType } from "@/utils/types";

function ButtonGreen(props: ButtonPropsType) {
  const style = `font-serif py-1 px-4 border-black/80 rounded-md bg-gradient-to-t from-green-800 to-green-500 text-white transition-all shadow-${props.shadowSize} shadow-${props.shadowColor} hover:text-yellow-400/90 hover:-translate-y-px`;
  return <button className={style}>{props.children}</button>;
}

export default ButtonGreen;
