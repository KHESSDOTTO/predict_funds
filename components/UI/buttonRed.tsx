import { ButtonProps } from "@/utils/types";

function ButtonRed(props: ButtonProps) {
  const style =
    "py-2 px-4 border-2 border-red-900 rounded-md bg-gradient-to-b from-red-900 to-red-500 text-white font-semibold hover:transition-all hover:text-yellow-300/90 hover:underline";
  return <button className={style}>{props.children}</button>;
}

export default ButtonRed;
