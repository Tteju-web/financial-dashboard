import { useState, useMemo } from "react";
import { transactions as initialData } from "../../data/mockData";
import { FiBriefcase, FiCoffee, FiShoppingBag, FiHome, FiCreditCard, FiSearch, FiPlus, FiTrendingUp, FiTrendingDown, FiX, FiActivity } from "react-icons/fi";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTip, Legend, ResponsiveContainer
} from "recharts";

const PIE_COLORS = ['#3b82f6', '#f97316', '#a855f7', '#10b981', '#f43f5e', '#eab308', '#06b6d4'];

const CATEGORIES = ["Salary", "Freelance", "Food", "Shopping", "Rent", "Utilities", "Travel", "Coffee", "Dining Out", "Groceries", "Other"];

const getCategoryDesign = (category) => {
  const c = category.toLowerCase();
  if (c.includes("salary") || c.includes("freelance")) return { icon: FiBriefcase, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-900/40" };
  if (c.includes("food") || c.includes("coffee") || c.includes("dining")) return { icon: FiCoffee, color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-100 dark:bg-orange-900/40" };
  if (c.includes("shop") || c.includes("grocer")) return { icon: FiShoppingBag, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-100 dark:bg-purple-900/40" };
  if (c.includes("rent") || c.includes("home") || c.includes("house")) return { icon: FiHome, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-900/40" };
  return { icon: FiCreditCard, color: "text-slate-600 dark:text-slate-400", bg: "bg-slate-100 dark:bg-slate-800" };
};

const EMPTY_FORM = { type: "expense", category: "Food", amount: "", date: new Date().toISOString().split("T")[0], note: "" };

function Transactions() {
  const [txList, setTxList] = useState(() => {
    const saved = localStorage.getItem("transactions");
    return saved ? JSON.parse(saved) : initialData;
  });
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [visibleCount, setVisibleCount] = useState(8);

  const saveAndUpdate = (updated) => {
    setTxList(updated);
    localStorage.setItem("transactions", JSON.stringify(updated));
  };

  const handleDelete = (id) => {
    saveAndUpdate(txList.filter(t => t.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) {
      setFormError("Please enter a valid amount.");
      return;
    }
    setFormError("");
    const newTx = { ...form, id: Date.now(), amount: Number(form.amount) };
    // Income categories override type
    if (["Salary", "Freelance"].includes(form.category)) newTx.type = "income";
    saveAndUpdate([newTx, ...txList]);
    setForm(EMPTY_FORM);
    setShowForm(false);
  };

  const filtered = useMemo(() => {
    setVisibleCount(8); // reset pagination on filter change
    return txList
      .filter(t => {
        const matchSearch = t.category.toLowerCase().includes(search.toLowerCase()) ||
          (t.note && t.note.toLowerCase().includes(search.toLowerCase()));
        const matchType = filterType === "all" || t.type === filterType;
        return matchSearch && matchType;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [txList, search, filterType]);

  const visibleRows = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const totalIncome = txList.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpense = txList.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);

  // --- Chart Data ---
  // 1. Monthly Area/Bar chart
  const monthlyData = useMemo(() => {
    const months = ["01","02","03","04","05","06","07","08","09","10","11","12"];
    const labels = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const agg = months.map((m, i) => ({ name: labels[i], Income: 0, Expense: 0 }));
    txList.forEach(t => {
      const idx = months.indexOf(t.date.split("-")[1]);
      if (idx !== -1) {
        if (t.type === "income") agg[idx].Income += t.amount;
        else agg[idx].Expense += t.amount;
      }
    });
    return agg.filter(d => d.Income > 0 || d.Expense > 0);
  }, [txList]);

  // 2. Donut pie — expense categories
  const pieData = useMemo(() => {
    const map = {};
    txList.filter(t => t.type === "expense").forEach(t => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value);
  }, [txList]);

  // 3. Net balance area over time (running total)
  const balanceData = useMemo(() => {
    const sorted = [...txList].sort((a,b) => new Date(a.date) - new Date(b.date));
    let running = 0;
    const seen = {};
    return sorted.map(t => {
      running += t.type === "income" ? t.amount : -t.amount;
      return { date: t.date, Balance: running };
    });
  }, [txList]);

  return (
    <div className="pb-10 animate-in fade-in duration-500">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Transactions</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Track every rupee in and out of your account.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl text-sm shadow-lg shadow-blue-500/25 transition-all transform hover:-translate-y-0.5"
        >
          <FiPlus size={18} /> Add Transaction
        </button>
      </div>

      {/* Summary Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
        <div className="bg-white dark:bg-gray-900/90 relative overflow-hidden p-6 rounded-3xl shadow-sm border border-gray-200/60 dark:border-gray-800 flex items-center gap-5 group hover:-translate-y-1 transition-transform">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
          <div className="p-4 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-2xl z-10">
            <FiTrendingUp size={28} className="stroke-[2.5]" />
          </div>
          <div className="z-10">
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Total Income</p>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">${totalIncome.toLocaleString()}</h3>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900/90 relative overflow-hidden p-6 rounded-3xl shadow-sm border border-gray-200/60 dark:border-gray-800 flex items-center gap-5 group hover:-translate-y-1 transition-transform">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-rose-500/10 dark:bg-rose-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
          <div className="p-4 bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 rounded-2xl z-10">
            <FiTrendingDown size={28} className="stroke-[2.5]" />
          </div>
          <div className="z-10">
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Total Expenses</p>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">${totalExpense.toLocaleString()}</h3>
          </div>
        </div>
      </div>

      {/* ===== CHARTS SECTION ===== */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">

        {/* 1. Net Balance Area Chart */}
        <div className="xl:col-span-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl">
              <FiActivity size={18} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">Net Balance Over Time</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Running cashflow trend</p>
            </div>
          </div>
          <div className="h-64">
            {balanceData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={balanceData}>
                  <defs>
                    <linearGradient id="balGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2}/>
                  <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 11 }} tickLine={false} axisLine={false} interval="preserveStartEnd"/>
                  <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => `$${v}`}/>
                  <RechartsTip formatter={v => [`$${v}`, 'Balance']} contentStyle={{ borderRadius: '0.75rem', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}/>
                  <Area type="monotone" dataKey="Balance" stroke="#3b82f6" strokeWidth={2.5} fill="url(#balGrad)" dot={false} activeDot={{ r: 5 }}/>
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">No data yet</div>
            )}
          </div>
        </div>

        {/* 2. Expense Breakdown Donut */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="font-bold text-slate-900 dark:text-white">Expense Breakdown</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">By category</p>
          </div>
          <div className="relative h-48">
            {pieData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value" stroke="none">
                      {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <RechartsTip formatter={v => `$${v}`} contentStyle={{ borderRadius: '0.75rem', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}/>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Total</span>
                  <span className="text-lg font-extrabold text-slate-900 dark:text-white">${totalExpense.toLocaleString()}</span>
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">No expenses yet</div>
            )}
          </div>
          {/* Legend */}
          <div className="flex flex-col gap-1.5 mt-4">
            {pieData.slice(0, 4).map((d, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}></span>
                  <span className="text-gray-600 dark:text-gray-400 font-medium">{d.name}</span>
                </div>
                <span className="font-bold text-slate-800 dark:text-slate-200">${d.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Monthly Income vs Expense Bar */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm mb-8">
        <div className="mb-6">
          <h3 className="font-bold text-slate-900 dark:text-white">Monthly Income vs Expense</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">Comparison across months</p>
        </div>
        <div className="h-64">
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2}/>
                <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 12 }} tickLine={false} axisLine={false}/>
                <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={v => `$${v}`}/>
                <RechartsTip cursor={{ fill: 'rgba(100,116,139,0.08)' }} contentStyle={{ borderRadius: '0.75rem', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}/>
                <Legend iconType="circle" wrapperStyle={{ fontSize: '13px' }}/>
                <Bar dataKey="Income" fill="#10b981" radius={[5,5,0,0]} maxBarSize={40}/>
                <Bar dataKey="Expense" fill="#f43f5e" radius={[5,5,0,0]} maxBarSize={40}/>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">No data yet</div>
          )}
        </div>
      </div>

      {/* Search + Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
          <input
            type="text"
            placeholder="Search by category or note..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm"
          />
        </div>
        <div className="flex gap-2">
          {["all", "income", "expense"].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all border capitalize ${
                filterType === type
                  ? type === "income"
                    ? "bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/25"
                    : type === "expense"
                    ? "bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-500/25"
                    : "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/25"
                  : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
              }`}
            >
              {type === "all" ? "All" : type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction Table */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
          <h3 className="font-bold text-slate-900 dark:text-white">Recent Transactions</h3>
          <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">{filtered.length} entries</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-gray-600 dark:text-gray-300">
            <thead className="bg-slate-50 dark:bg-gray-800/80 border-b border-gray-100 dark:border-gray-800">
              <tr>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Note</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/80">
              {visibleRows.map((t) => {
                const design = getCategoryDesign(t.category);
                const Icon = design.icon;
                return (
                  <tr key={t.id} className="hover:bg-slate-50/80 dark:hover:bg-gray-800/40 transition-colors group">
                    <td className="px-6 py-4 text-gray-400 dark:text-gray-500 font-mono text-xs">{t.date}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${design.bg} ${design.color} shrink-0`}><Icon size={16} /></div>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{t.category}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-xs max-w-[140px] truncate">{t.note || "—"}</td>
                    <td className="px-6 py-4">
                      <span className={`font-extrabold text-base ${t.type === "income" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                        {t.type === "income" ? "+" : "-"}${t.amount.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold leading-none border ${
                        t.type === "income"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50"
                          : "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400 border-rose-200 dark:border-rose-800/50"
                      }`}>
                        {t.type === "income" ? "↑ Income" : "↓ Expense"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="p-1.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        title="Delete transaction"
                      >
                        <FiX size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">💸</p>
              <p className="text-gray-500 dark:text-gray-400 font-medium">No transactions found.</p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Try adjusting your search or filters.</p>
            </div>
          )}

          {/* Show More / Show Less */}
          {filtered.length > 0 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-slate-50/50 dark:bg-gray-800/30">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Showing <span className="font-semibold text-slate-800 dark:text-slate-200">{Math.min(visibleCount, filtered.length)}</span> of <span className="font-semibold text-slate-800 dark:text-slate-200">{filtered.length}</span> transactions
              </span>
              <div className="flex gap-2">
                {hasMore && (
                  <button
                    onClick={() => setVisibleCount(v => v + 8)}
                    className="px-4 py-2 text-sm font-semibold rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-700 transition-all shadow-sm"
                  >
                    Show More ↓
                  </button>
                )}
                {visibleCount > 8 && (
                  <button
                    onClick={() => setVisibleCount(8)}
                    className="px-4 py-2 text-sm font-semibold rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all shadow-sm"
                  >
                    Show Less ↑
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Transaction Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100 dark:border-gray-800">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Add Transaction</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Fill in the details below</p>
              </div>
              <button onClick={() => { setShowForm(false); setFormError(""); }} className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Type Toggle */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Type</label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
                  {["income", "expense"].map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, type: t }))}
                      className={`py-2.5 rounded-lg text-sm font-semibold transition-all capitalize ${
                        form.type === t
                          ? t === "income" ? "bg-emerald-500 text-white shadow-sm" : "bg-rose-500 text-white shadow-sm"
                          : "text-gray-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-slate-300"
                      }`}
                    >
                      {t === "income" ? "↑ Income" : "↓ Expense"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Category</label>
                <select
                  value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none cursor-pointer"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Amount ($)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">$</span>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    placeholder="0.00"
                    value={form.amount}
                    onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                    className="w-full pl-8 pr-4 py-3 bg-slate-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
                {formError && <p className="text-rose-500 text-xs mt-1.5 font-medium">{formError}</p>}
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Date</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>

              {/* Note */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Note <span className="font-normal text-gray-400">(optional)</span></label>
                <input
                  type="text"
                  placeholder="e.g. Monthly rent payment"
                  value={form.note}
                  onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 transition-all transform hover:-translate-y-0.5"
              >
                + Add Transaction
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Transactions;
