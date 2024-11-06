import { ButtonPropsType } from "@/utils/types/generalTypes/types";

function ButtonIndigo(props: ButtonPropsType) {
  const style = `duration-300 rounded-md bg-gradient-to-t from-indigo-800 to-indigo-400 text-white py-1 px-4 border-indigo-800 transition-all shadow-${props.shadowSize} shadow-${props.shadowColor} hover:text-yellow-500 hover:-translate-y-px`;
  return <button className={style}>{props.children}</button>;
}

export default ButtonIndigo;
