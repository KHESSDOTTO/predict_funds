import { ButtonProps } from "@/utils/types";

function OptionButtonRed(props: ButtonProps) {
  const btnClass =
    "rounded-sm flex justify-center flex-col items-center border-b box-shadow font-bold py-2 px-4 w-64 mt-2 w-full hover:text-red-900 transition-all hover:bg-gradient-to-t hover:from-red-200/70 hover:to-transparent";
  return <button className={btnClass}>{props.children}</button>;
}

export default OptionButtonRed;
