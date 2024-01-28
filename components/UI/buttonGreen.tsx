import { ButtonPropsType } from "@/utils/types";

function ButtonGreen(props: ButtonPropsType) {
  const style =
    "font-serif py-1 px-4 border border-black/80 rounded-md bg-gradient-to-b from-green-800 to-green-500 text-white transition-all hover:text-yellow-400/90 hover:underline";
  return <button className={style}>{props.children}</button>;
}

export default ButtonGreen;
