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
import { useState } from "react";
import { format, parseISO, addDays } from "date-fns";

function Dashboard() {
  const data = [];
  const [showPessimistic, setShowPessimistic] = useState(false),
    [showOptimistic, setShowOptimistic] = useState(false),
    [showNetFunding, setShowNetFunding] = useState(true);

  function togglePessimistic() {
    setShowPessimistic(!showPessimistic);
  }

  function toggleOptimistic() {
    setShowOptimistic(!showOptimistic);
  }

  function toggleNetFunding() {
    setShowNetFunding(!showNetFunding);
  }

  for (let i = 0; i < 12; i++) {
    const val = Math.random() * 12;
    data.push({
      date: addDays(new Date(), 7 * i)
        .toISOString()
        .substring(0, 10),
      std1Less: val - 5,
      netFunding: val,
      std1More: val + 5,
    });
  }

  return (
    <>
      <div className="grid items-center grid-rows-5 md:grid-rows-1 md:grid-cols-12">
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
      <div className="flex justify-around">
        <OptionButtonRed
          handleClick={togglePessimistic}
          showing={showPessimistic}
        >
          Pessimistic
        </OptionButtonRed>
        <OptionButtonIndigo
          handleClick={toggleNetFunding}
          showing={showNetFunding}
        >
          Neutral
        </OptionButtonIndigo>
        <OptionButtonGreen
          handleClick={toggleOptimistic}
          showing={showOptimistic}
        >
          Optimistic
        </OptionButtonGreen>
      </div>
      <div className="border-4 bg-gradient-to-b from-black to-gray-600">
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
              dataKey="date"
              tick={{ fill: "rgb(230, 230, 230)" }}
              height={50}
              tickLine={false}
              tickFormatter={(date) => {
                return format(parseISO(date), "MMM, d");
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
                dataKey="netFunding"
                stroke="purple"
                fill="url(#customIndigo)"
              ></Area>
            )}
            {showPessimistic && (
              <Area
                type="monotone"
                dataKey="std1Less"
                stroke="red"
                fill="url(#customRed)"
              ></Area>
            )}
            {showOptimistic && (
              <Area
                type="monotone"
                dataKey="std1More"
                stroke="green"
                fill="url(#customGreen)"
              ></Area>
            )}
            <Tooltip
              content={
                <CustomTooltip
                  showNetFunding={showNetFunding}
                  showOptimistic={showOptimistic}
                  showPessimistic={showPessimistic}
                />
              }
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}

function CustomTooltip({
  active,
  payload,
  label,
  showNetFunding,
  showOptimistic,
  showPessimistic,
}) {
  // console.log(JSON.stringify(payload));
  if (active) {
    return (
      <div className="bg-black/80 text-white p-2 rounded-sm">
        <h4 className="font-semibold ">{format(parseISO(label), "d, MMM")}</h4>
        {showPessimistic && (
          <p>Less 1std: R${payload[0].payload.std1Less.toFixed(2)}mln</p>
        )}
        {showNetFunding && (
          <p>Net Funding: R${payload[0].payload.netFunding.toFixed(2)}mln</p>
        )}
        {showOptimistic && (
          <p>More 1std: R${payload[0].payload.std1More.toFixed(2)}mln</p>
        )}
      </div>
    );
  }
  return <></>;
}

export default Dashboard;
