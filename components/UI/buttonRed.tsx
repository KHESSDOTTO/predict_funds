import { ButtonProps } from "@/utils/types";

function ButtonRed(props: ButtonProps) {
  const style =
    "font-serif py-1 px-4 border-2 border-red-900 rounded-md bg-gradient-to-b from-red-900 to-red-500 text-white transition-all hover:text-yellow-300/90 hover:underline";
  return <button className={style}>{props.children}</button>;
}

export default ButtonRed;
