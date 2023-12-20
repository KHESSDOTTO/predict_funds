import { ButtonProps } from "@/utils/types";

function ButtonIndigo(props: ButtonProps) {
  const style =
    "duration-300 rounded-md bg-gradient-to-b from-indigo-800 to-indigo-300 text-white py-1 px-4 border-2 border-indigo-900 transition-all hover:text-yellow-500 hover:underline";
  return <button className={style}>{props.children}</button>;
}

export default ButtonIndigo;
