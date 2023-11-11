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

  for (let i = 0; i < 10; i++) {
    const val = Math.random() * 10;
    data.push({
      date: addDays(new Date(), 7 * i)
        .toISOString()
        .substring(0, 10),
      "1std less": val - 5,
      "Net Funding": val,
      "1std more": val + 5,
    });
  }

  function togglePessimistic(e) {
    setShowPessimistic(!showPessimistic);
  }

  function toggleOptimistic(e) {
    setShowOptimistic(!showOptimistic);
  }

  function toggleNetFunding(e) {
    setShowNetFunding(!showNetFunding);
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
            {showNetFunding && (
              <Area
                type="monotone"
                dataKey="Net Funding"
                stroke="purple"
                fill="url(#customIndigo)"
              ></Area>
            )}
            {showPessimistic && (
              <Area
                type="monotone"
                dataKey="1std less"
                stroke="red"
                fill="url(#customRed)"
              ></Area>
            )}
            {showOptimistic && (
              <Area
                type="monotone"
                dataKey="1std more"
                stroke="green"
                fill="url(#customGreen)"
              ></Area>
            )}
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
            <Tooltip />
            <CartesianGrid vertical={false} stroke="rgb(170, 150, 255)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}

export default Dashboard;
