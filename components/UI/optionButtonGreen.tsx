function OptionButtonGreen(props) {
  const btnClass =
    "rounded-sm flex justify-center flex-col items-center border-b box-shadow font-bold py-2 px-4 w-64 mt-2 w-full hover:text-green-700 hover:transition-all hover:bg-gradient-to-t hover:from-green-200/40 hover:to-transparent";
  return (
    <button onClick={props.handleClick} className={btnClass}>
      {props.children}
    </button>
  );
}

export default OptionButtonGreen;
