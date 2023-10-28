import {
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
  ResponsiveContainer,
} from "recharts";

function Dashboard() {
  const data = [];
  for (let i = 0; i < 10; i++) {
    data.push({
      name: `Name ${i}`,
      value: Math.random() * 10,
    });
  }
  return (
    <div className="border-4 bg-gradient-to-b from-black to-gray-600">
      <ResponsiveContainer height={400}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="10%" stopColor="#8884d8" stopOpacity={0.9} />
              <stop offset="90%" stopColor="#8884d8" stopOpacity={0.2} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke="purple"
            fill="url(#colorUv)"
          ></Area>
          <XAxis dataKey="name" tick={{ fill: "rgb(230, 230, 230)" }} />
          <YAxis tick={{ fill: "rgb(230, 230, 230)" }} />
          <Tooltip />
          <CartesianGrid vertical={false} stroke="rgb(170, 150, 255)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Dashboard;
