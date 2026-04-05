import { useState } from "react";
import { transactions } from "../data/mockData";
import { FiSearch, FiPlus, FiBriefcase, FiCoffee, FiShoppingBag, FiHome, FiCreditCard } from "react-icons/fi";

const getCategoryDesign = (category) => {
  const c = category.toLowerCase();
  if (c.includes("salary") || c.includes("income")) return { icon: FiBriefcase, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-900/30" };
  if (c.includes("food") || c.includes("drink") || c.includes("coffee") || c.includes("dining")) return { icon: FiCoffee, color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-100 dark:bg-orange-900/30" };
  if (c.includes("shop") || c.includes("retail") || c.includes("grocer")) return { icon: FiShoppingBag, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-100 dark:bg-purple-900/30" };
  if (c.includes("rent") || c.includes("home") || c.includes("house")) return { icon: FiHome, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-900/30" };
  return { icon: FiCreditCard, color: "text-slate-600 dark:text-slate-400", bg: "bg-slate-100 dark:bg-slate-800" };
};

function TransactionList({ role }) {
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(5);

  const filtered = transactions.filter(t =>
    t.category.toLowerCase().includes(search.toLowerCase())
  );

  const visibleRows = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <div className="bg-white dark:bg-gray-900/90 border border-gray-200/60 dark:border-gray-800 p-6 rounded-2xl mt-6 shadow-sm">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-slate-900 dark:text-white text-xl font-bold tracking-tight">Recent Transactions</h2>

        <div className="flex w-full sm:w-auto items-center gap-3">
          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search category..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-gray-800/50 text-slate-900 dark:text-white border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-sm"
              onChange={(e) => { setSearch(e.target.value); setVisibleCount(5); }}
            />
          </div>

          {role === "admin" && (
            <button className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition whitespace-nowrap shadow-md shadow-blue-500/20 hover:-translate-y-0.5">
              <FiPlus size={16} /> Add 
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-800">
        <table className="w-full text-sm text-gray-600 dark:text-gray-300">
          <thead className="bg-slate-50 dark:bg-gray-800/80 text-slate-600 dark:text-gray-300 border-b border-gray-100 dark:border-gray-800">
            <tr>
              <th className="px-4 py-3.5 text-left font-semibold">Date</th>
              <th className="px-4 py-3.5 text-left font-semibold">Category</th>
              <th className="px-4 py-3.5 text-left font-semibold">Amount</th>
              <th className="px-4 py-3.5 text-left font-semibold">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 dark:divide-gray-800/80">
            {visibleRows.map((t, i) => (
              <tr key={i} className="hover:bg-slate-50/80 dark:hover:bg-gray-800/40 transition-colors group">
                <td className="px-4 py-3.5 text-gray-500 dark:text-gray-400 font-medium group-hover:text-slate-700 dark:group-hover:text-gray-300 transition-colors">{t.date}</td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    {(() => {
                      const design = getCategoryDesign(t.category);
                      const Icon = design.icon;
                      return (
                        <div className={`p-2 rounded-lg ${design.bg} ${design.color} shrink-0`}>
                          <Icon size={16} />
                        </div>
                      )
                    })()}
                    <span className="font-medium text-slate-800 dark:text-slate-200">{t.category}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5 font-bold tracking-tight text-slate-800 dark:text-slate-200">
                  ${t.amount}
                </td>
                <td className="px-4 py-3.5">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold leading-none ${
                    t.type === "income" 
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" 
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  }`}>
                    {t.type === "income" ? "+" : "-"} {t.type.charAt(0).toUpperCase() + t.type.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 font-medium">No transactions found for "{search}"</p>
        </div>
      )}

      {/* Show More / Show Less Footer */}
      {filtered.length > 0 && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Showing <span className="font-semibold text-slate-800 dark:text-slate-200">{Math.min(visibleCount, filtered.length)}</span> of <span className="font-semibold text-slate-800 dark:text-slate-200">{filtered.length}</span>
          </span>
          <div className="flex gap-2">
            {hasMore && (
              <button
                onClick={() => setVisibleCount(v => v + 5)}
                className="px-4 py-1.5 text-sm font-semibold rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-700 transition-all shadow-sm"
              >
                Show More ↓
              </button>
            )}
            {visibleCount > 5 && (
              <button
                onClick={() => setVisibleCount(5)}
                className="px-4 py-1.5 text-sm font-semibold rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all shadow-sm"
              >
                Show Less ↑
              </button>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

export default TransactionList;