function IndigoButton(props) {
  const style =
    "rounded-md bg-gradient-to-b from-indigo-700 to-indigo-300 text-white font-semibold py-2 px-8 mt-8 border-2 border-indigo-800 hover:text-xl hover:transition-all hover:text-yellow-500 hover:underline";
  return (
    <>
      {props.onClick ? (
        <IndigoButtonOnClick style={style}>
          {props.children}
        </IndigoButtonOnClick>
      ) : (
        <IndigoButtonRegular style={style}>
          {props.children}
        </IndigoButtonRegular>
      )}
    </>
  );
}

// Se prop `onClick` n'ao for passado
function IndigoButtonRegular(props) {
  return <button className={props.style}>{props.children}</button>;
}

// Se prop `onClick` for passado
function IndigoButtonOnClick(props) {
  return (
    <button className={props.style} onClick={props.onClick}>
      {props.children}
    </button>
  );
}

export default IndigoButton;
