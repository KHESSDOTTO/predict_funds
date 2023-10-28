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

function Dashboard() {
  const data = [];
  for (let i = 0; i < 10; i++) {
    const val = Math.random() * 10;
    data.push({
      name: `Name${i}`,
      valuePes: val - 5,
      value: val,
      valueOpt: val + 5,
    });
  }

  function handleClick() {
    return;
  }

  return (
    <>
      <div className="flex justify-end items-center flex-col md:flex-row">
        <p className="font-bold">Expectations: </p>
        <PredictCard data={data} time={"Week"} />
        <PredictCard data={data} time={"Month"} />
        <PredictCard data={data} time={"Three Months"} />
      </div>
      <div className="flex justify-around">
        <OptionButtonRed handleClick={handleClick}>Pessimistic</OptionButtonRed>
        <OptionButtonIndigo handleClick={handleClick}>
          Neutral
        </OptionButtonIndigo>
        <OptionButtonGreen handleClick={handleClick}>
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
            <Area
              type="monotone"
              dataKey="value"
              stroke="purple"
              fill="url(#customIndigo)"
            ></Area>
            <Area
              type="monotone"
              dataKey="valuePes"
              stroke="red"
              fill="url(#customRed)"
            ></Area>
            <Area
              type="monotone"
              dataKey="valueOpt"
              stroke="green"
              fill="url(#customGreen)"
            ></Area>
            <XAxis dataKey="name" tick={{ fill: "rgb(230, 230, 230)" }} />
            <YAxis tick={{ fill: "rgb(230, 230, 230)" }} />
            <Tooltip />
            <CartesianGrid vertical={false} stroke="rgb(170, 150, 255)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}

export default Dashboard;
