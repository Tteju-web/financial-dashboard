import { transactions } from "../data/mockData";
import { FiStar, FiShield, FiActivity } from "react-icons/fi";

function Insights() {
  // Calculate totals
  const expenses = transactions.filter(t => t.type === "expense");

  const categoryMap = {};
  expenses.forEach(t => {
    categoryMap[t.category] =
      (categoryMap[t.category] || 0) + t.amount;
  });

  const topCategory = Object.keys(categoryMap).reduce((a, b) =>
    categoryMap[a] > categoryMap[b] ? a : b
  );

  const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0);

  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const savings = totalIncome - totalExpense;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">

      {/* Top Category */}
      <div className="bg-gradient-to-br from-white to-slate-50 dark:from-gray-900 dark:to-gray-800/60 border border-gray-200/60 dark:border-gray-800 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-4 group">
        <div className="p-4 bg-orange-100 dark:bg-orange-900/30 text-orange-500 rounded-xl group-hover:scale-110 transition-transform hidden sm:block">
          <FiStar size={24} className="stroke-[2]" />
        </div>
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Top Category</p>
          <h2 className="text-slate-900 dark:text-white text-xl font-bold mt-0.5 capitalize">
            {topCategory}
          </h2>
        </div>
      </div>

      {/* Total Savings */}
      <div className="bg-gradient-to-br from-white to-slate-50 dark:from-gray-900 dark:to-gray-800/60 border border-gray-200/60 dark:border-gray-800 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-4 group">
        <div className="p-4 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 rounded-xl group-hover:scale-110 transition-transform hidden sm:block">
          <FiShield size={24} className="stroke-[2]" />
        </div>
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Monthly Savings</p>
          <h2 className="text-emerald-600 dark:text-emerald-400 text-xl font-bold mt-0.5">
            ${savings.toLocaleString()}
          </h2>
        </div>
      </div>

      {/* Expense vs Income */}
      <div className="bg-gradient-to-br from-white to-slate-50 dark:from-gray-900 dark:to-gray-800/60 border border-gray-200/60 dark:border-gray-800 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-4 group">
        <div className="p-4 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-xl group-hover:scale-110 transition-transform hidden sm:block">
          <FiActivity size={24} className="stroke-[2]" />
        </div>
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Expense Ratio</p>
          <h2 className="text-red-600 dark:text-red-400 text-xl font-bold mt-0.5">
            {((totalExpense / totalIncome) * 100).toFixed(1)}%
          </h2>
        </div>
      </div>

    </div>
  );
}

export default Insights;