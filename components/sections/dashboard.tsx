import {
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
  ResponsiveContainer,
} from "recharts";
import { ax } from "@/database/axios.config";
import PredictCard from "../UI/predictCard";
import OptionButtonGreen from "../UI/optionButtonGreen";
import OptionButtonIndigo from "../UI/optionButtonIndigo";
import OptionButtonRed from "../UI/optionButtonRed";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import ButtonIndigo from "../UI/buttonIndigo";
import toast from "react-hot-toast";

function Dashboard({ user }) {
  const [showPessimistic, setShowPessimistic] = useState(false),
    [showOptimistic, setShowOptimistic] = useState(false),
    [showNetFunding, setShowNetFunding] = useState(true),
    [data, setData] = useState([]),
    [controlForm, setControlForm] = useState({
      buscaCnpj: "",
      DI: 0.1,
      varCota: 0,
    });

  useEffect(() => {
    if (data[0]) {
      setControlForm({
        ...controlForm,
        buscaCnpj: data[0].CNPJ_FUNDO ? data[0].CNPJ_FUNDO : "",
      });
    }
  }, [data]);

  useEffect(() => {
    const getData = async () => {
      try {
        const encodedParam = encodeURIComponent(user.cnpj);
        const newData = await ax.get(
          `/rawData/getAllFromCnpj?cnpj=${encodedParam}`
        );
        console.log(newData);
        let finalData = newData.data.slice(-60, -1);
        finalData = finalData.map((cE) => {
          const convDate = new Date(cE.DT_COMPTC);
          return { ...cE, DT_COMPTC: convDate };
        });
        setData(finalData);
        console.log("Here after setData(newData);");
        return;
      } catch (err) {
        console.log(err);
      }
    };
    getData();
    return;
  }, []);

  const thresholdDate = new Date("2023-03-01");

  function getColor(entry) {
    const entryDate = new Date(entry);
    return entryDate >= thresholdDate ? "red" : "green";
  }

  function togglePessimistic() {
    setShowPessimistic(!showPessimistic);
  }

  function toggleOptimistic() {
    setShowOptimistic(!showOptimistic);
  }

  function toggleNetFunding() {
    setShowNetFunding(!showNetFunding);
  }

  function handleControlFormChange(e) {
    let newVal = e.target.value;
    if (e.target.name === "buscaCnpj") {
      const cnpjNum = e.target.value.replaceAll(/[.\/-]/gm, ""),
        lenNum = cnpjNum.length,
        len = e.target.value.length,
        specialChars = [".", "/", "-"];
      if (!specialChars.includes(e.target.value[len - 2])) {
        switch (lenNum) {
          case 3:
            newVal =
              e.target.value.slice(0, lenNum - 1) +
              "." +
              e.target.value.slice(lenNum - 1, lenNum);
            break;
          case 6:
            newVal =
              e.target.value.slice(0, lenNum) +
              "." +
              e.target.value.slice(lenNum, lenNum + 1);
            break;
          case 9:
            newVal =
              e.target.value.slice(0, lenNum + 1) +
              "/" +
              e.target.value.slice(lenNum + 1, lenNum + 2);
            break;
          case 13:
            newVal =
              e.target.value.slice(0, lenNum + 2) +
              "-" +
              e.target.value.slice(lenNum + 2, lenNum + 3);
            break;
          case 15:
            newVal = e.target.value.slice(0, len - 1);
            break;
          default:
            break;
        }
      }
    }
    setControlForm({ ...controlForm, [e.target.name]: newVal });
    return;
  }

  async function handleControlFormSubmit(e) {
    e.preventDefault();
    const loadingToast = toast.loading("Fetching data...");
    try {
      const encodedParam = encodeURIComponent(controlForm.buscaCnpj);
      const newData = await ax.get(
        `/rawData/getAllFromCnpj?cnpj=${encodedParam}`
      );
      console.log(newData);
      let finalData = newData.data.slice(-60, -1);
      finalData = finalData.map((cE) => {
        const convDate = new Date(cE.DT_COMPTC);
        return { ...cE, DT_COMPTC: convDate };
      });
      setData(finalData);
      toast.success("Done.");
      toast.dismiss(loadingToast);
    } catch (err) {
      console.log(err);
      toast.error("Sorry. We had a problem handling the request.");
      toast.dismiss(loadingToast);
    }
  }

  return (
    <div className="grid grid-rows-5 md:grid-cols-12 md:grid-rows-1">
      <section id="controls" className="col-span-4 px-8">
        <h2 className="font-bold text-2xl text-center py-12 underline">
          Control section
        </h2>
        <form id="controlForm" onSubmit={handleControlFormSubmit}>
          <div className="flex flex-row gap-8">
            <div className="flex flex-col gap-4 font-semibold">
              <label htmlFor="buscaCnpj" className="h-8">
                CNPJ to show
              </label>
              <label htmlFor="DI" className="h-8">
                DI
              </label>
              <label htmlFor="varCota" className="h-8">
                Quota variation (%)
              </label>
            </div>
            <div className="flex flex-col gap-4">
              <div className="h-8">
                <input
                  type="text"
                  id="buscaCnpj"
                  name="buscaCnpj"
                  className="rounded-md border-2 border-black px-2"
                  value={controlForm.buscaCnpj}
                  onChange={handleControlFormChange}
                ></input>
              </div>
              <div className="flex h-8 gap-4 text-sm">
                <span className="range-value w-12">
                  {(controlForm.DI * 100).toFixed(2)}%
                </span>
                <input
                  type="range"
                  id="DI"
                  name="DI"
                  min={0.01}
                  max={0.2}
                  step={0.0025}
                  className="indigo-500"
                  value={controlForm.DI}
                  onChange={handleControlFormChange}
                ></input>
              </div>
              <div className="flex h-8 gap-4">
                <span
                  className="range-value w-12 text-sm"
                  style={{
                    color:
                      controlForm.varCota < 0
                        ? "red"
                        : controlForm.varCota == 0
                        ? ""
                        : "green",
                  }}
                >
                  {(controlForm.varCota * 100).toFixed(2)}%
                </span>
                <input
                  type="range"
                  id="varCota"
                  name="varCota"
                  min={-0.99}
                  max={1.5}
                  step={0.01}
                  className="indigo-500"
                  value={controlForm.varCota}
                  onChange={handleControlFormChange}
                ></input>
              </div>
            </div>
          </div>
          <div className="text-center mt-6">
            <ButtonIndigo>Update</ButtonIndigo>
          </div>
        </form>
      </section>
      <div className="col-start-5 col-span-12">
        <div className="flex justify-around">
          <OptionButtonRed
            handleClick={togglePessimistic}
            showing={showPessimistic}
          >
            Forecast - 1 std
          </OptionButtonRed>
          <OptionButtonIndigo
            handleClick={toggleNetFunding}
            showing={showNetFunding}
          >
            Forecast
          </OptionButtonIndigo>
          <OptionButtonGreen
            handleClick={toggleOptimistic}
            showing={showOptimistic}
          >
            Forecast + 1 std
          </OptionButtonGreen>
        </div>
        <div className="border-4 bg-gray-900 py-4 pl-8 pr-2 rounded-xl">
          <ResponsiveContainer height={400}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="customIndigo" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="10%" stopColor="#8884d8" stopOpacity={0.9} />
                  <stop offset="90%" stopColor="#8884d8" stopOpacity={0.2} />
                </linearGradient>
                <linearGradient id="customRed" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="10%"
                    stopColor="rgb(255, 200, 200)"
                    stopOpacity={0.9}
                  />
                  <stop
                    offset="90%"
                    stopColor="rgb(255, 200, 200)"
                    stopOpacity={0.3}
                  />
                </linearGradient>
                <linearGradient id="customGreen" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="10%"
                    stopColor="rgb(240, 255, 240)"
                    stopOpacity={0.9}
                  />
                  <stop
                    offset="90%"
                    stopColor="rgb(240, 255, 240)"
                    stopOpacity={0.2}
                  />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="DT_COMPTC"
                tick={{ fill: "rgb(230, 230, 230)" }}
                height={50}
                tickLine={false}
                tickFormatter={(DT_COMPTC) => {
                  return format(DT_COMPTC, "MMM, d");
                }}
              />
              <YAxis
                tick={{ fill: "rgb(230, 230, 230)" }}
                tickFormatter={(num) => `R$${num.toFixed(2)}`}
                width={100}
              />
              <CartesianGrid vertical={false} stroke="rgb(170, 150, 255)" />
              {showNetFunding && (
                <Area
                  type="monotone"
                  dataKey="CAPTC_LIQ"
                  stroke={getColor}
                  fill="url(#customIndigo)"
                ></Area>
              )}
              {/* {showPessimistic && (
                <Area
                  type="monotone"
                  dataKey="std1Less"
                  stroke="red"
                  fill="url(#customRed)"
                ></Area>
              )} */}
              {/* {showOptimistic && (
                <Area
                  type="monotone"
                  dataKey="std1More"
                  stroke="green"
                  fill="url(#customGreen)"
                ></Area>
              )} */}
              <Tooltip
                content={
                  <CustomTooltip
                    showNetFunding={showNetFunding}
                    // showOptimistic={showOptimistic}
                    // showPessimistic={showPessimistic}
                  />
                }
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="grid items-center grid-rows-5 col-span-12 md:grid-rows-1 md:grid-cols-12">
        <div className="flex justify-center items-center col-span-3">
          <p className="font-bold inline underline text-2xl px-4">
            Expectations:
          </p>
        </div>
        <div className="my-4 col-span-9 flex flex-col items-center justify-around md:flex-row">
          <PredictCard data={data} time={"Week"} />
          <PredictCard data={data} time={"Month"} />
          <PredictCard data={data} time={"Three Months"} />
        </div>
      </div>
    </div>
  );
}

function CustomTooltip({
  active,
  payload,
  label,
  showNetFunding,
  // showOptimistic,
  // showPessimistic,
}) {
  if (active && label && payload) {
    return (
      <div className="bg-black/30 text-white p-2 rounded-md shadow-indigo-700 shadow-md">
        <h4 className="font-semibold">{format(label, "d, MMM")}</h4>
        {/* {showPessimistic && (
          <p>Less 1std: R${payload[0].payload.std1Less.toFixed(2)}mln</p>
        )} */}
        {showNetFunding && (
          <p>
            Net Funding: R$
            {payload[0].payload.CAPTC_LIQ.toFixed(2).toLocaleString("en-US")}
          </p>
        )}
        {/* {showOptimistic && (
          <p>More 1std: R${payload[0].payload.std1More.toFixed(2)}mln</p>
        )} */}
      </div>
    );
  }
  return <></>;
}

export default Dashboard;
