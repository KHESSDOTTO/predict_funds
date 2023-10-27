function IndigoButton(props) {
  const style =
    "rounded-md bg-gradient-to-b from-indigo-600 to-indigo-400 text-white font-semibold py-2 px-8 mt-8 border-2 border-indigo-800 hover:text-xl hover:transition-all hover:text-yellow-500 hover:underline";

  return (
    <button className={style} onClick={props.onClick ? props.onClick : ""}>
      {props.children}
    </button>
  );
}

export default IndigoButton;
