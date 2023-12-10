import { ButtonProps } from "@/utils/types";

function ButtonIndigo(props: ButtonProps) {
  const style =
    "rounded-md bg-gradient-to-b from-indigo-800 to-indigo-300 text-white py-2 px-4 border-2 border-indigo-800 transition-all hover:text-yellow-400 hover:underline";
  return <button className={style}>{props.children}</button>;
}

export default ButtonIndigo;
