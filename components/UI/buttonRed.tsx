function ButtonRed(props) {
  const style =
    "mx-4 my-2 py-2 px-4 border-2 border-red-900 rounded-md bg-gradient-to-b from-red-700 to-red-500 text-white font-semibold hover:transition-all hover:text-yellow-300/90 hover:underline";
  return (
    <button className={style} onClick={props.onClick ? props.onClick : ""}>
      {props.children}
    </button>
  );
}

export default ButtonRed;
