function OptionButtonIndigo(props) {
  const btnClass =
    "rounded-sm flex justify-center flex-col items-center border-b box-shadow font-bold py-2 px-4 w-64 mt-2 w-full hover:text-indigo-900 hover:transition-all hover:bg-gradient-to-t hover:from-indigo-200/70 hover:to-transparent";
  return (
    <button onClick={props.handleClick} className={btnClass}>
      {props.children}
    </button>
  );
}

export default OptionButtonIndigo;
