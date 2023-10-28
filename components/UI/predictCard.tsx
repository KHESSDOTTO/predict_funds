function PredictCard(props) {
  const total = props.data.reduce((ac, cE) => {
    return ac + cE.value;
  }, 0);

  const txtColorPosi = "text-green-700",
    txtColorNega = "text-red-700",
    bgColorPosi = "from-green-100/50",
    bgColorNega = "from-red-100/50",
    pClass = `${total < 0 ? txtColorNega : txtColorPosi} underline`,
    divClass = `rounded-md flex justify-center flex-col items-center border-2 border-gray-700 box-shadow bg-gradient-to-b ${
      total < 0 ? bgColorNega : bgColorPosi
    } to-white font-bold py-4 w-64 m-4 shadow-lg shadow-gray-700 cursor-pointer`;

  return (
    <div className={divClass}>
      <h2 className="text-lg underline text-gray-800">Total - {props.time}</h2>
      <p className={pClass}>Expected: R$ {total.toFixed(2)}</p>
    </div>
  );
}

export default PredictCard;
