import { LineChart, Line, ResponsiveContainer } from "recharts";
import { FiDollarSign, FiTrendingUp, FiTrendingDown, FiTarget } from "react-icons/fi";

const data = [
  { value: 2000 },
  { value: 3000 },
  { value: 2500 },
  { value: 4000 },
  { value: 3500 },
];

function Card({ title, amount, color, icon: Icon, bgLight, bgDark }) {
  return (
    <div className="bg-white dark:bg-gray-900/90 border border-gray-200/60 dark:border-gray-800 p-5 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group">
      {/* Decorative gradient blur in background */}
      <div className={`absolute -right-6 -top-6 w-28 h-28 rounded-full opacity-20 dark:opacity-10 blur-2xl ${bgLight} dark:${bgDark} group-hover:scale-150 transition-transform duration-700`}></div>
      
      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{title}</p>
          <h2 className="text-slate-900 dark:text-white text-2xl font-bold mt-1 tracking-tight">
            ${amount}
          </h2>
        </div>
        <div className={`p-3 rounded-xl ${bgLight} dark:${bgDark} bg-opacity-30 dark:bg-opacity-30`}>
          <Icon color={color} size={22} className="stroke-[2.5]" />
        </div>
      </div>
      
      {/* Mini Chart */}
      <div className="h-12 mt-4 -mx-1 relative z-10 opacity-80 group-hover:opacity-100 transition-opacity">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={3}
              dot={false}
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function SummaryCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <Card title="Total Balance" amount="2,000" color="#3b82f6" icon={FiDollarSign} bgLight="bg-blue-100" bgDark="bg-blue-800" />
      <Card title="Income" amount="5,000" color="#10b981" icon={FiTrendingUp} bgLight="bg-emerald-100" bgDark="bg-emerald-800" />
      <Card title="Expenses" amount="3,000" color="#ef4444" icon={FiTrendingDown} bgLight="bg-red-100" bgDark="bg-red-800" />
      <Card title="Savings" amount="1,500" color="#8b5cf6" icon={FiTarget} bgLight="bg-violet-100" bgDark="bg-violet-800" />
    </div>
  );
}

export default SummaryCards;