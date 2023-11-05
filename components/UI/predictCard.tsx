function PredictCard(props) {
  const total = props.data.reduce((ac, cE) => {
    return ac + cE.value;
  }, 0);

  const txtColorPosi = "text-indigo-900",
    txtColorNega = "text-red-800",
    bgColorPosi = "from-indigo-900/30",
    bgColorNega = "from-red-900/30",
    pClass = `${total < 0 ? txtColorNega : txtColorPosi} underline `,
    divClass1 = `rounded-md flex flex-col justify-center items-center border-2 border-gray-700 box-shadow bg-gradient-to-b ${
      total < 0 ? bgColorNega : bgColorPosi
    } to-white font-bold w-64 m-4 shadow-lg shadow-indigo-900 cursor-pointer text-gray-800 hover:text-indigo-900 hover:transition-all hover:bg-indigo-300/40`;

  return (
    <div className={divClass1}>
      <div className=" border-b border-b-black w-full flex justify-center gap-2 items-center pt-2 pb-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6"
        >
          <path d="M12 7.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" />
          <path
            fillRule="evenodd"
            d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 14.625v-9.75zM8.25 9.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM18.75 9a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75V9.75a.75.75 0 00-.75-.75h-.008zM4.5 9.75A.75.75 0 015.25 9h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75V9.75z"
            clipRule="evenodd"
          />
          <path d="M2.25 18a.75.75 0 000 1.5c5.4 0 10.63.722 15.6 2.075 1.19.324 2.4-.558 2.4-1.82V18.75a.75.75 0 00-.75-.75H2.25z" />
        </svg>
        <h2 className="text-lg">Total - {props.time}</h2>
      </div>
      <div className="flex justify-center items-center text-lg py-4">
        <p className={pClass}>Expected: R$ {total.toFixed(2)}</p>
      </div>
    </div>
  );
}

export default PredictCard;
