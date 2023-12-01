import {
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
  ResponsiveContainer,
} from "recharts";
import PredictCard from "../UI/predictCard";
import OptionButtonGreen from "../UI/optionButtonGreen";
import OptionButtonIndigo from "../UI/optionButtonIndigo";
import OptionButtonRed from "../UI/optionButtonRed";
import { useEffect, useState } from "react";
import { format, parseISO, addDays } from "date-fns";

function Dashboard({ data }) {
  const [showPessimistic, setShowPessimistic] = useState(false),
    [showOptimistic, setShowOptimistic] = useState(false),
    [showNetFunding, setShowNetFunding] = useState(true);
  console.log("data inside dashboard");
  console.log(data);

  function togglePessimistic() {
    setShowPessimistic(!showPessimistic);
  }

  function toggleOptimistic() {
    setShowOptimistic(!showOptimistic);
  }

  function toggleNetFunding() {
    setShowNetFunding(!showNetFunding);
  }

  // for (let i = 0; i < 12; i++) {
  //   const val = Math.random() * 12;
  //   data.push({
  //     date: addDays(new Date(), 7 * i)
  //       .toISOString()
  //       .substring(0, 10),
  //     std1Less: val - 5,
  //     netFunding: val,
  //     std1More: val + 5,
  //   });
  // }

  return (
    <div className="grid grid-rows-5 md:grid-cols-12 md:grid-rows-1">
      <div id="controls" className="col-span-4">
        Control section
      </div>
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
        <div className="border-4 bg-gray-900 pb-8 rounded-xl">
          <ResponsiveContainer height={400}>
            <AreaChart data={data} className="pt-8">
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
                  return format(parseISO(DT_COMPTC), "MMM, d");
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
                  stroke="purple"
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
  console.log(JSON.stringify(payload));
  console.log("label");
  console.log(label);
  console.log(typeof label);
  if (active && label && payload) {
    return (
      <div className="bg-black/30 text-white p-2 rounded-md shadow-indigo-700 shadow-md">
        <h4 className="font-semibold">{format(parseISO(label), "d, MMM")}</h4>
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
