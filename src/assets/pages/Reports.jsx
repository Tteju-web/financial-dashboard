import { useState, useMemo } from "react";
import { transactions } from "../../data/mockData";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import { FiFilter, FiCalendar, FiTag, FiDollarSign, FiTrendingUp, FiTrendingDown, FiTarget, FiBriefcase, FiCoffee, FiShoppingBag, FiHome, FiCreditCard } from "react-icons/fi";
import ExportButton from "../../components/ExportButton";

const COLORS = ['#3b82f6', '#f97316', '#a855f7', '#10b981', '#f43f5e', '#eab308'];

const getCategoryDesign = (category) => {
  const c = category.toLowerCase();
  if (c.includes("salary") || c.includes("income")) return { icon: FiBriefcase, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-900/40" };
  if (c.includes("food") || c.includes("drink") || c.includes("coffee") || c.includes("dining")) return { icon: FiCoffee, color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-100 dark:bg-orange-900/40" };
  if (c.includes("shop") || c.includes("retail") || c.includes("grocer")) return { icon: FiShoppingBag, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-100 dark:bg-purple-900/40" };
  if (c.includes("rent") || c.includes("home") || c.includes("house")) return { icon: FiHome, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-900/40" };
  return { icon: FiCreditCard, color: "text-slate-600 dark:text-slate-400", bg: "bg-slate-100 dark:bg-slate-800" };
};

function Reports() {
  const [filterDate, setFilterDate] = useState("all"); // 'all', 'monthly', 'yearly' (mock simplification)
  const [filterCategory, setFilterCategory] = useState("all");

  // Get unique categories for the filter
  const categories = ["all", ...new Set(transactions.map(t => t.category))];

  // 1. Apply Filters
  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];
    
    if (filterCategory !== "all") {
      filtered = filtered.filter(t => t.category === filterCategory);
    }
    
    if (filterDate === "monthly") {
      // Mock 'monthly' as just filtering the current month (April 2026)
      filtered = filtered.filter(t => t.date.startsWith("2026-04"));
    } else if (filterDate === "yearly") {
      // Mock 'yearly' as current year (2026)
      filtered = filtered.filter(t => t.date.startsWith("2026"));
    }

    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [filterCategory, filterDate]);

  // 2. Summary Metrics Calculation
  const metrics = useMemo(() => {
    let income = 0;
    let expense = 0;
    
    filteredTransactions.forEach(t => {
      if (t.type === "income") income += t.amount;
      else if (t.type === "expense") expense += t.amount;
    });

    // In a real app balance usually requires a starting amount, we assume just sum of all time.
    const savings = income - expense;
    const balance = 15000 + savings; // dummy initial balance of 15k

    return { income, expense, savings, balance };
  }, [filteredTransactions]);

  // 3. Bar Chart Data (Monthly Income vs Expense)
  // We aggregate only if viewing all or yearly.
  const barChartData = useMemo(() => {
    const months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
    const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    const aggregated = months.map((m, idx) => ({ name: monthLabels[idx], Income: 0, Expense: 0 }));
    
    filteredTransactions.forEach(t => {
      const monthStr = t.date.split("-")[1]; // "01", "02"
      const monthIdx = months.indexOf(monthStr);
      if (monthIdx !== -1) {
        if (t.type === "income") aggregated[monthIdx].Income += t.amount;
        else aggregated[monthIdx].Expense += t.amount;
      }
    });
    
    // Filter out months with no data for a cleaner chart
    return aggregated.filter(d => d.Income > 0 || d.Expense > 0);
  }, [filteredTransactions]);

  // 4. Pie Chart Data (Spending breakdown by category)
  const pieChartData = useMemo(() => {
    const expenses = filteredTransactions.filter(t => t.type === "expense");
    const map = {};
    expenses.forEach(t => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
    return Object.keys(map).map(key => ({
      name: key,
      value: map[key]
    })).sort((a,b) => b.value - a.value);
  }, [filteredTransactions]);


  return (
    <div className="animate-in fade-in duration-500 pb-10">
      
      {/* Header & Export */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Analytics Reports</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Detailed breakdown of your financial trajectory.</p>
        </div>
        <ExportButton data={filteredTransactions} filename={`report_${filterDate}_${filterCategory}.csv`} />
      </div>

      {/* Filters Bar */}
      <div className="bg-gradient-to-r from-slate-50 to-white dark:from-gray-900/80 dark:to-gray-800/50 border border-gray-200/60 dark:border-gray-800 p-5 rounded-2xl shadow-sm mb-8 flex flex-col sm:flex-row gap-5 items-center backdrop-blur-xl">
        <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-semibold whitespace-nowrap bg-white dark:bg-gray-800 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700/50 shadow-sm">
          <FiFilter className="text-blue-500" /> Options
        </div>
        
        {/* Date Filter */}
        <div className="relative w-full sm:w-auto overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700/50 shadow-sm transition-all focus-within:ring-2 focus-within:ring-blue-500/50">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <FiCalendar className="text-blue-500" />
          </div>
          <select 
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="w-full sm:w-56 pl-10 pr-4 py-3 bg-white dark:bg-gray-800/80 text-slate-900 dark:text-white focus:outline-none appearance-none cursor-pointer font-medium"
          >
            <option value="all">All Time</option>
            <option value="yearly">This Year (2026)</option>
            <option value="monthly">This Month (April 2026)</option>
          </select>
        </div>

        {/* Category Filter */}
        <div className="relative w-full sm:w-auto overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700/50 shadow-sm transition-all focus-within:ring-2 focus-within:ring-blue-500/50">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <FiTag className="text-purple-500" />
          </div>
          <select 
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full sm:w-56 pl-10 pr-4 py-3 bg-white dark:bg-gray-800/80 text-slate-900 dark:text-white focus:outline-none appearance-none cursor-pointer capitalize font-medium"
          >
            {categories.map((c, i) => (
              <option key={i} value={c}>{c === "all" ? "All Categories" : c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 1. Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Income */}
        <div className="bg-white dark:bg-gray-900/90 relative overflow-hidden p-6 rounded-3xl shadow-sm border border-gray-200/60 dark:border-gray-800 flex items-center gap-5 hover:-translate-y-1 transition-transform group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
          <div className="p-4 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-2xl relative z-10">
            <FiTrendingUp size={28} className="stroke-[2.5]" />
          </div>
          <div className="relative z-10">
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Total Income</p>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">${metrics.income.toLocaleString()}</h3>
          </div>
        </div>
        
        {/* Expenses */}
        <div className="bg-white dark:bg-gray-900/90 relative overflow-hidden p-6 rounded-3xl shadow-sm border border-gray-200/60 dark:border-gray-800 flex items-center gap-5 hover:-translate-y-1 transition-transform group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-rose-500/10 dark:bg-rose-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
          <div className="p-4 bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 rounded-2xl relative z-10">
            <FiTrendingDown size={28} className="stroke-[2.5]" />
          </div>
          <div className="relative z-10">
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Total Expenses</p>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">${metrics.expense.toLocaleString()}</h3>
          </div>
        </div>

        {/* Savings */}
        <div className="bg-white dark:bg-gray-900/90 relative overflow-hidden p-6 rounded-3xl shadow-sm border border-gray-200/60 dark:border-gray-800 flex items-center gap-5 hover:-translate-y-1 transition-transform group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-violet-500/10 dark:bg-violet-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
          <div className="p-4 bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 rounded-2xl relative z-10">
            <FiTarget size={28} className="stroke-[2.5]" />
          </div>
          <div className="relative z-10">
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Savings</p>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">${metrics.savings.toLocaleString()}</h3>
          </div>
        </div>

        {/* Balance */}
        <div className="bg-white dark:bg-gray-900/90 relative overflow-hidden p-6 rounded-3xl shadow-sm border border-gray-200/60 dark:border-gray-800 flex items-center gap-5 hover:-translate-y-1 transition-transform group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
          <div className="p-4 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-2xl relative z-10">
            <FiDollarSign size={28} className="stroke-[2.5]" />
          </div>
          <div className="relative z-10">
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Total Balance</p>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">${metrics.balance.toLocaleString()}</h3>
          </div>
        </div>
      </div>

      {/* 2. Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        
        {/* Bar Chart */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Income vs Expense</h3>
          <div className="h-80 w-full">
            {barChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.3} />
                  <XAxis dataKey="name" tick={{fill: '#6b7280'}} tickLine={false} axisLine={false} />
                  <YAxis tick={{fill: '#6b7280'}} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                  <RechartsTooltip cursor={{fill: '#4b5563', opacity: 0.1}} contentStyle={{borderRadius: '0.75rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                  <Legend iconType="circle" />
                  <Bar dataKey="Income" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  <Bar dataKey="Expense" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">No chart data for applied filters</div>
            )}
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Spending Breakdown</h3>
          <div className="flex-1 min-h-[320px] relative">
            {pieChartData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip formatter={(val) => `$${val}`} contentStyle={{borderRadius: '0.75rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center Label inside Donut */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Spent</span>
                  <span className="text-2xl font-bold text-slate-900 dark:text-white">${metrics.expense.toLocaleString()}</span>
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">No expenses found for applied filters</div>
            )}
          </div>
        </div>
      </div>

      {/* 4. Transactions Table */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Filtered Transactions</h3>
        
        <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-800">
          <table className="w-full text-sm text-gray-600 dark:text-gray-300">
            <thead className="bg-slate-50 dark:bg-gray-800/80 text-slate-600 dark:text-gray-300 border-b border-gray-100 dark:border-gray-800">
              <tr>
                <th className="px-4 py-3.5 text-left font-semibold">Date</th>
                <th className="px-4 py-3.5 text-left font-semibold">Category</th>
                <th className="px-4 py-3.5 text-left font-semibold">Amount</th>
                <th className="px-4 py-3.5 text-left font-semibold">Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/80">
              {filteredTransactions.map((t, i) => {
                const design = getCategoryDesign(t.category);
                const Icon = design.icon;

                return (
                  <tr key={t.id || i} className="hover:bg-slate-50/80 dark:hover:bg-gray-800/40 transition-colors group">
                    <td className="px-4 py-4 text-gray-500 dark:text-gray-400 font-medium group-hover:text-slate-700 dark:group-hover:text-gray-300 transition-colors">{t.date}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${design.bg} ${design.color} shrink-0`}>
                          <Icon size={18} />
                        </div>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{t.category}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 font-extrabold tracking-tight text-slate-800 dark:text-slate-200 text-base">
                      ${t.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold leading-none ${
                          t.type === "income" 
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50" 
                            : "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400 border border-rose-200 dark:border-rose-800/50"
                        }`}>
                        {t.type === "income" ? "+" : "-"} {t.type.charAt(0).toUpperCase() + t.type.slice(1)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {filteredTransactions.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 font-medium">No results found.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

export default Reports;
