import { Bell, Search, Clock, Calendar } from "lucide-react";
import { useState, useEffect } from "react";

function Header() {
  const [profile, setProfile] = useState({
    name: "Teju",
    role: "Admin",
    avatar: ""
  });
  
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const loadProfile = () => {
      const saved = localStorage.getItem("userProfile");
      if (saved) {
        setProfile(JSON.parse(saved));
      }
    };
    
    loadProfile();
    
    // Listen for custom event when profile updates from Profile.jsx Without refresh
    window.addEventListener("profileUpdated", loadProfile);
    
    // Clock Timer
    const timer = setInterval(() => setTime(new Date()), 1000);
    
    return () => {
      window.removeEventListener("profileUpdated", loadProfile);
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="flex items-center justify-between px-5 py-2.5 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 h-14">
      
      {/* Left Section */}
      <div className="flex-1">
        <h1 className="text-base font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
          Dashboard
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Welcome back, {profile.name}! Here's what's happening today.
        </p>
      </div>

      {/* Center Section - Stylish Date & Clock */}
      <div className="hidden xl:flex items-center gap-4 px-4 py-1.5 bg-gradient-to-r from-slate-50 to-gray-100 dark:from-gray-800/80 dark:to-gray-800/40 rounded-xl border border-gray-200/60 dark:border-gray-700/50 shadow-inner backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Calendar size={15} className="text-purple-500" />
          <span className="font-semibold text-slate-700 dark:text-slate-200 text-xs tracking-wide">
            {time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </span>
        </div>
        <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
        <div className="flex items-center gap-2">
          <Clock size={15} className="text-blue-500" />
          <span className="font-mono font-bold text-slate-800 dark:text-slate-100 text-xs tracking-tight">
            {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        </div>
      </div>

      {/* Right Section */}
      <HeaderActions profile={profile} />
    </div>
  );
}

// ── Separate component so it can use its own state cleanly ──────────────────
const CATEGORIES = ["Salary", "Freelance", "Food", "Shopping", "Rent", "Utilities", "Travel", "Coffee", "Dining Out", "Groceries", "Other"];
const EMPTY_FORM = { type: "expense", category: "Food", amount: "", date: new Date().toISOString().split("T")[0], note: "" };

const NOTIFICATIONS = [
  { id: 1, icon: "💰", title: "Salary credited", desc: "$5,000 added to your account", time: "2h ago", unread: true },
  { id: 2, icon: "⚠️", title: "High expense alert", desc: "Shopping exceeded $300 this month", time: "5h ago", unread: true },
  { id: 3, icon: "📊", title: "Monthly report ready", desc: "Your April report is now available", time: "1d ago", unread: false },
  { id: 4, icon: "🎯", title: "Savings goal reached!", desc: "You've hit your $1,000 savings target", time: "2d ago", unread: false },
];

function HeaderActions({ profile }) {
  const [showNew, setShowNew] = useState(false);
  const [showBell, setShowBell] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) {
      setFormError("Please enter a valid amount.");
      return;
    }
    const newTx = { ...form, id: Date.now(), amount: Number(form.amount) };
    if (["Salary", "Freelance"].includes(form.category)) newTx.type = "income";

    // Save to localStorage so Transactions page picks it up
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
      <div className="flex items-center gap-3 flex-1 justify-end">

        {/* Search */}
        <div className="hidden md:flex items-center bg-gray-100 dark:bg-gray-800/80 px-3 py-2 rounded-xl border border-transparent focus-within:border-gray-300 dark:focus-within:border-gray-700 transition-colors">
          <Search size={16} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search anything..."
            className="bg-transparent outline-none ml-2 text-sm text-black dark:text-white w-32 lg:w-44"
          />
        </div>

        {/* + New Button */}
        <button
          onClick={() => setShowNew(true)}
          className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold px-4 py-2 rounded-xl text-sm shadow-md shadow-blue-500/25 transition-all transform hover:-translate-y-0.5"
        >
          <span className="text-base leading-none">+</span> New
        </button>

        {/* Bell */}
        <div className="relative">
          <button
            onClick={() => setShowBell(v => !v)}
            className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 dark:text-gray-400"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-white dark:border-gray-900">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {showBell && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setShowBell(false)} />
              <div className="absolute right-0 top-12 z-40 w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">Notifications</h3>
                  <button onClick={markAllRead} className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline">Mark all read</button>
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800">
                  {notifications.map(n => (
                    <div
                      key={n.id}
                      onClick={() => setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, unread: false } : x))}
                      className={`flex gap-3 px-4 py-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-gray-800/50 transition-colors ${n.unread ? "bg-blue-50/50 dark:bg-blue-900/10" : ""}`}
                    >
                      <span className="text-xl shrink-0 mt-0.5">{n.icon}</span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{n.title}</p>
                          {n.unread && <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0"></span>}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{n.desc}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800 text-center">
                  <button className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline">View all notifications</button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Profile */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-gray-200 dark:border-gray-700 ml-1">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[90px] leading-tight">{profile.name}</p>
            <p className="text-xs text-blue-500 dark:text-blue-400 font-medium truncate max-w-[90px]">{profile.role}</p>
          </div>
          {/* Avatar with visible ring */}
          <div className="relative shrink-0 cursor-pointer group">
            <div className="w-10 h-10 rounded-full ring-2 ring-blue-500/60 ring-offset-2 ring-offset-white dark:ring-offset-gray-900 overflow-hidden shadow-md transition-all group-hover:ring-blue-500">
              <img
                src={profile.avatar || `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(profile.name || "User")}&backgroundColor=b6e3f4,c0aede,d1d4f9&shapeColor=0d47a1`}
                alt={profile.name || "User"}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name || "U")}&background=3b82f6&color=fff&size=80&bold=true&rounded=true`;
                }}
              />
            </div>
            {/* Online indicator */}
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-gray-900 rounded-full"></span>
          </div>
        </div>

      </div>

      {/* ── Quick Add Transaction Modal ───────────────────────────────── */}
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
              {/* Type toggle */}
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

export default Header;