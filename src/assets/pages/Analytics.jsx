import React from "react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie
} from "recharts";
import { FiTrendingUp, FiArrowUpRight, FiUsers, FiDollarSign, FiActivity } from "react-icons/fi";

const analyticsData = [
  { name: "Mon", revenue: 4200, users: 240 },
  { name: "Tue", revenue: 3800, users: 210 },
  { name: "Wed", revenue: 5100, users: 290 },
  { name: "Thu", revenue: 4800, users: 270 },
  { name: "Fri", revenue: 6200, users: 340 },
  { name: "Sat", revenue: 7500, users: 410 },
  { name: "Sun", revenue: 6900, users: 380 },
];

const categoryData = [
  { name: "Organic", value: 45, color: "#6366f1" },
  { name: "Referral", value: 25, color: "#10b981" },
  { name: "Direct", value: 20, color: "#f59e0b" },
  { name: "Social", value: 10, color: "#f43f5e" },
];

const StatCard = ({ title, value, change, icon: Icon, color }) => (
  <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl ${color} bg-opacity-10 text-${color.split('-')[1]}-600 dark:text-${color.split('-')[1]}-400`}>
        <Icon size={24} />
      </div>
      <div className="flex items-center gap-1 text-emerald-500 font-bold text-sm bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-lg">
        <FiArrowUpRight size={14} />
        {change}%
      </div>
    </div>
    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">{title}</p>
    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{value}</h3>
  </div>
);

function Analytics() {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Performance Analytics</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">Deep dive into your financial growth and user engagement.</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 shadow-sm focus:ring-2 focus:ring-blue-500/20 outline-none">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last 12 Months</option>
          </select>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-500/20">
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value="$48,592.00" change="12.5" icon={FiDollarSign} color="bg-blue-500" />
        <StatCard title="Active Users" value="12,482" change="8.2" icon={FiUsers} color="bg-indigo-500" />
        <StatCard title="Growth Rate" value="24.8%" change="15.1" icon={FiTrendingUp} color="bg-emerald-500" />
        <StatCard title="Engagement" value="68.4%" change="4.3" icon={FiActivity} color="bg-purple-500" />
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Revenue Trend Area Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Revenue Over Time</h2>
              <p className="text-sm text-gray-400 dark:text-gray-500 font-medium">Daily revenue insights for the current week</p>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-500/10 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400">Revenue</span>
              </div>
            </div>
          </div>

          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analyticsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} tickFormatter={(v) => `$${v}`} />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '1rem', 
                    border: 'none', 
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    padding: '12px 16px'
                  }}
                  itemStyle={{ fontWeight: 700, fontSize: '14px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#3b82f6" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorRev)" 
                  activeDot={{ r: 8, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Acquisition Pie Chart */}
        <div className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight mb-1">Acquisition Channels</h2>
          <p className="text-sm text-gray-400 dark:text-gray-500 font-medium mb-8">Where your users are coming from</p>
          
          <div className="relative flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                  cornerRadius={10}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-black text-slate-900 dark:text-white">100%</span>
              <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Distribution</span>
            </div>
          </div>

          <div className="space-y-4 mt-6">
            {categoryData.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                  <span className="text-sm font-bold text-slate-600 dark:text-slate-400">{item.name}</span>
                </div>
                <span className="text-sm font-black text-slate-900 dark:text-white">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
