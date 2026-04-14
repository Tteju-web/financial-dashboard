import {
  AreaChart, Area,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";

const barData = [
  { month: "Jan", Income: 5000, Expense: 1850 },
  { month: "Feb", Income: 5000, Expense: 2130 },
  { month: "Mar", Income: 5400, Expense: 2080 },
  { month: "Apr", Income: 5000, Expense: 2135 },
];

const areaData = [
  { month: "Jan", Balance: 3150 },
  { month: "Feb", Balance: 6020 },
  { month: "Mar", Balance: 9340 },
  { month: "Apr", Balance: 12205 },
];

const pieData = [
  { name: "Rent",      value: 6000 },
  { name: "Food",      value: 550  },
  { name: "Shopping",  value: 650  },
  { name: "Utilities", value: 330  },
  { name: "Travel",    value: 400  },
  { name: "Other",     value: 275  },
];

const PIE_COLORS = ["#6366f1", "#10b981", "#f97316", "#3b82f6", "#f43f5e", "#eab308"];

const CustomBarTip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-3 rounded-xl shadow-xl text-sm">
        <p className="font-bold text-slate-800 dark:text-white mb-2">{label}</p>
        {payload.map((p, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }}></span>
            <span className="text-gray-500 dark:text-gray-400">{p.name}:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">${p.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const CustomAreaTip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-3 rounded-xl shadow-xl text-sm">
        <p className="font-bold text-slate-800 dark:text-white mb-1">{label}</p>
        <p className="text-blue-500 font-semibold">Balance: ${payload[0]?.value?.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

function Charts() {
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 640);
  const total = pieData.reduce((sum, d) => sum + d.value, 0);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">

      {/* ── Left: Stacked Bar + Area ── */}
      <div className="flex flex-col gap-6">

        {/* Grouped Bar Chart */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-800 p-5 rounded-2xl shadow-sm">
          <div className="mb-4">
            <h2 className="text-slate-900 dark:text-white font-bold text-base tracking-tight">Monthly Overview</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Income vs Expense comparison</p>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} barGap={4} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#059669" stopOpacity={0.8}/>
                  </linearGradient>
                  <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f43f5e" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#e11d48" stopOpacity={0.8}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.15}/>
                <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 12 }} tickLine={false} axisLine={false}/>
                <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`}/>
                <Tooltip content={<CustomBarTip />} cursor={{ fill: 'rgba(100,116,139,0.06)', radius: 8 }}/>
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}/>
                <Bar dataKey="Income" fill="url(#incomeGrad)" radius={[6, 6, 0, 0]} maxBarSize={32}/>
                <Bar dataKey="Expense" fill="url(#expenseGrad)" radius={[6, 6, 0, 0]} maxBarSize={32}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Net Balance Area Chart */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-800 p-5 rounded-2xl shadow-sm">
          <div className="mb-4">
            <h2 className="text-slate-900 dark:text-white font-bold text-base tracking-tight">Balance Trend</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Running net balance over time</p>
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.15}/>
                <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 12 }} tickLine={false} axisLine={false}/>
                <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`}/>
                <Tooltip content={<CustomAreaTip />} cursor={{ stroke: '#6366f1', strokeWidth: 1.5, strokeDasharray: '4 4' }}/>
                <Area type="monotone" dataKey="Balance" stroke="#6366f1" strokeWidth={2.5} fill="url(#areaGrad)" dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* ── Right: Premium Donut ── */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-800 p-5 rounded-2xl shadow-sm flex flex-col">
        <div className="mb-4">
          <h2 className="text-slate-900 dark:text-white font-bold text-base tracking-tight">Spending Breakdown</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Expense distribution by category</p>
        </div>

        <div className="relative flex-1 min-h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                {PIE_COLORS.map((c, i) => (
                  <linearGradient key={i} id={`pg${i}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={c} stopOpacity={1}/>
                    <stop offset="100%" stopColor={c} stopOpacity={0.7}/>
                  </linearGradient>
                ))}
              </defs>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={isMobile ? 65 : 75}
                outerRadius={isMobile ? 95 : 110}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
                startAngle={90}
                endAngle={-270}
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={`url(#pg${i})`}/>
                ))}
              </Pie>
              <Tooltip
                formatter={(v) => [`$${v.toLocaleString()}`, '']}
                contentStyle={{ borderRadius: '0.75rem', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', fontSize: '13px' }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Center Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Total Spent</span>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">${total.toLocaleString()}</span>
          </div>
        </div>

        {/* Legend Grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 mt-5">
          {pieData.map((d, i) => {
            const pct = ((d.value / total) * 100).toFixed(0);
            return (
              <div key={i} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ background: PIE_COLORS[i] }}></span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">{d.name}</p>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500">{pct}% · ${d.value.toLocaleString()}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

export default Charts;