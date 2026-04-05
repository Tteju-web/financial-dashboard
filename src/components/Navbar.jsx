import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  FiTrendingUp, FiBell, FiSearch, FiSun, FiMoon, FiLogOut, FiPlus, FiUser
} from "react-icons/fi";
import { getStoredName } from "../auth/authUtils";


const CATEGORIES = ["Salary", "Freelance", "Food", "Shopping", "Rent", "Utilities", "Travel", "Coffee", "Dining Out", "Groceries", "Other"];
const EMPTY_FORM = { type: "expense", category: "Food", amount: "", date: new Date().toISOString().split("T")[0], note: "" };

const NOTIFICATIONS = [
  { id: 1, icon: "💰", title: "Salary credited", desc: "$5,000 added to your account", time: "2h ago", unread: true },
  { id: 2, icon: "⚠️", title: "High expense alert", desc: "Shopping exceeded $300 this month", time: "5h ago", unread: true },
  { id: 3, icon: "📊", title: "Monthly report ready", desc: "Your April report is now available", time: "1d ago", unread: false },
  { id: 4, icon: "🎯", title: "Savings goal reached!", desc: "You've hit your $1,000 savings target", time: "2d ago", unread: false },
];

function Navbar({ onLogout }) {

  const [profile, setProfile] = useState({ name: getStoredName(), role: "Admin", avatar: "" });
  const [time, setTime] = useState(new Date());
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      if (saved) return saved === "dark";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return true;
  });
  const [showBell, setShowBell] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [searchVal, setSearchVal] = useState("");

  const unreadCount = notifications.filter(n => n.unread).length;

  useEffect(() => {
    const loadProfile = () => {
      const saved = localStorage.getItem("userProfile");
      if (saved) setProfile(JSON.parse(saved));
    };
    loadProfile();
    window.addEventListener("profileUpdated", loadProfile);
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => {
      window.removeEventListener("profileUpdated", loadProfile);
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) {
      setFormError("Please enter a valid amount.");
      return;
    }
    const newTx = { ...form, id: Date.now(), amount: Number(form.amount) };
    if (["Salary", "Freelance"].includes(form.category)) newTx.type = "income";
    const existing = JSON.parse(localStorage.getItem("transactions") || "[]");
    localStorage.setItem("transactions", JSON.stringify([newTx, ...existing]));
    window.dispatchEvent(new Event("transactionsUpdated"));
    setForm(EMPTY_FORM);
    setFormError("");
    setShowNew(false);
  };

  const markAllRead = () => setNotifications(n => n.map(x => ({ ...x, unread: false })));

  return (
    <>
      {/* ── Top Navbar ─────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="flex items-center h-16 gap-4" style={{ paddingLeft: "0", paddingRight: "20px" }}>

          {/* ── Brand — fixed width matching sidebar ── */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 px-5" style={{ width: "200px" }}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <FiTrendingUp size={18} className="text-white" />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">Financial</p>
              <p className="text-[11px] font-semibold text-blue-500 dark:text-blue-400 tracking-wide">Dashboard</p>
            </div>
          </Link>

          {/* ── Center Section: Centered Search Bar ── */}
          <div className="flex-1 flex justify-center px-4">
            <div className="relative w-full max-w-md group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <FiSearch size={16} className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search Analytics..."
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                className="block w-full px-12 py-2.5 bg-gray-100 dark:bg-gray-800 border border-transparent focus:border-blue-500/50 dark:focus:border-blue-500/30 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-500/5 rounded-2xl text-sm text-slate-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all outline-none text-center"
              />
            </div>
          </div>
          {/* ── Right Controls ── */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Status & Clock (Hidden on mobile) */}
            <div className="hidden xl:flex items-center gap-3 mr-2 px-3 py-1 border-r border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full border border-emerald-500/20">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
                <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-500 uppercase tracking-tighter">Active</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-sm font-bold text-slate-900 dark:text-white font-mono leading-none tracking-tight">
                  {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
                </span>
                <span className="text-[10px] text-blue-500 dark:text-blue-400 font-semibold uppercase tracking-wider mt-0.5">
                  {time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </span>
              </div>
            </div>

            {/* + New */}
            <button
              onClick={() => setShowNew(true)}
              className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold px-3.5 py-2 rounded-xl text-xs shadow-md shadow-blue-500/25 transition-all hover:-translate-y-0.5"
            >
              <FiPlus size={14} />
              <span className="hidden sm:inline">New</span>
            </button>

            {/* Dark / Light */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title={darkMode ? "Light Mode" : "Dark Mode"}
            >
              {darkMode ? <FiSun size={16} className="text-yellow-500" /> : <FiMoon size={16} className="text-blue-400" />}
            </button>

            {/* Bell */}
            <div className="relative">
              <button
                onClick={() => { setShowBell(v => !v); setShowProfile(false); }}
                className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 dark:text-gray-400"
              >
                <FiBell size={17} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border border-white dark:border-gray-900">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showBell && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setShowBell(false)} />
                  <div className="absolute right-0 top-11 z-40 w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm">Notifications</h3>
                      <button onClick={markAllRead} className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline">Mark all read</button>
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800">
                      {notifications.map(n => (
                        <div
                          key={n.id}
                          onClick={() => setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, unread: false } : x))}
                          className={`flex gap-3 px-4 py-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-gray-800/50 transition-colors ${n.unread ? "bg-blue-50/50 dark:bg-blue-900/10" : ""}`}
                        >
                          <span className="text-lg shrink-0">{n.icon}</span>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{n.title}</p>
                              {n.unread && <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0" />}
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{n.desc}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="px-4 py-2.5 border-t border-gray-100 dark:border-gray-800 text-center">
                      <button className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline">View all</button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Divider */}
            <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => { setShowProfile(v => !v); setShowBell(false); }}
                className="flex items-center gap-2.5 pl-1 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 pr-2 py-1 transition-colors"
              >
                <div className="relative">
                  <div className="w-8 h-8 rounded-full ring-2 ring-blue-500/50 ring-offset-1 ring-offset-white dark:ring-offset-gray-900 overflow-hidden">
                    <img
                      src={
                        profile.avatar ||
                        `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(profile.name || "User")}&backgroundColor=b6e3f4,c0aede&shapeColor=0d47a1`
                      }
                      alt={profile.name}
                      className="w-full h-full object-cover"
                      onError={e => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name || "U")}&background=3b82f6&color=fff&size=64&bold=true`;
                      }}
                    />
                  </div>
                  <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 border border-white dark:border-gray-900 rounded-full" />
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{profile.name}</p>
                  <p className="text-[10px] text-blue-500 dark:text-blue-400 font-medium leading-tight">{profile.role}</p>
                </div>
              </button>

              {/* Profile dropdown */}
              {showProfile && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setShowProfile(false)} />
                  <div className="absolute right-0 top-11 z-40 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden py-1.5">
                    <Link to="/profile" onClick={() => setShowProfile(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      <FiUser size={14} /> My Profile
                    </Link>
                    <div className="my-1 border-t border-gray-100 dark:border-gray-800" />
                    <button
                      onClick={() => { setShowProfile(false); onLogout(); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <FiLogOut size={14} /> Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>

          </div>
        </div>
      </nav>

      {/* ── Quick Add Modal ─────────────────────────────────────────────────── */}
      {showNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100 dark:border-gray-800">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Quick Add Transaction</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Fill in the details below</p>
              </div>
              <button onClick={() => { setShowNew(false); setFormError(""); }} className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-xl leading-none">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
                {["income", "expense"].map(t => (
                  <button key={t} type="button" onClick={() => setForm(f => ({ ...f, type: t }))}
                    className={`py-2.5 rounded-lg text-sm font-semibold transition-all ${form.type === t ? t === "income" ? "bg-emerald-500 text-white shadow-sm" : "bg-rose-500 text-white shadow-sm" : "text-gray-500 dark:text-gray-400"}`}>
                    {t === "income" ? "↑ Income" : "↓ Expense"}
                  </button>
                ))}
              </div>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none cursor-pointer">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">$</span>
                <input type="number" min="1" step="0.01" placeholder="Amount" value={form.amount}
                  onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                  className="w-full pl-8 pr-4 py-3 bg-slate-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
              </div>
              {formError && <p className="text-rose-500 text-xs font-medium">{formError}</p>}
              <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
              <input type="text" placeholder="Note (optional)" value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
              <button type="submit" className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 transition-all transform hover:-translate-y-0.5">
                + Add Transaction
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
