import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import {
  FiHome, FiBarChart2, FiRepeat, FiFileText, FiUser, FiZap, FiX
} from "react-icons/fi";
import UpgradeModal from "./UpgradeModal";


const NAV_LINKS = [
  { to: "/",              label: "Dashboard",     Icon: FiHome },
  { to: "/analytics",    label: "Analytics",     Icon: FiBarChart2 },
  { to: "/transactions", label: "Transactions",  Icon: FiRepeat },
  { to: "/reports",      label: "Reports",       Icon: FiFileText },
  { to: "/profile",      label: "Profile",       Icon: FiUser },
];

function Sidebar({ onClose }) {
  const location = useLocation();
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);


  return (
    <div className="w-full h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col relative">

      {/* ── Mobile Close Button ── */}
      <button 
        onClick={onClose}
        className="md:hidden absolute right-4 top-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
      >
        <FiX size={20} />
      </button>

      {/* ── Section Label ── */}
      <div className="px-4 pt-5 pb-2">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 px-1">
          Main Menu
        </p>
      </div>

      {/* ── Nav Links ── */}
      <ul className="px-3 space-y-0.5 flex-1 mt-2">
        {NAV_LINKS.map(({ to, label, Icon }) => {
          const active = location.pathname === to;
          return (
            <li key={to}>
              <Link
                to={to}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 font-medium text-sm relative ${
                  active
                    ? "bg-blue-500/10 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                {/* Active left bar */}
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full" />
                )}
                <Icon
                  size={17}
                  className={active ? "text-blue-500" : "text-gray-400 dark:text-gray-500"}
                />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>



      {/* ── Premium Card ── */}
      <div className="mx-3 mb-6 mt-auto p-4 rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-700 shadow-lg shadow-blue-500/20 relative overflow-hidden group">
        {/* Decorative circle */}
        <div className="absolute -right-2 -top-2 w-12 h-12 bg-white/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />
        
        <div className="relative z-10">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center mb-3">
            <FiZap className="text-white" size={16} />
          </div>
          <p className="text-sm font-bold text-white mb-1">Upgrade to Pro</p>
          <p className="text-[10px] text-indigo-100 leading-relaxed mb-3">
            Get advanced analytics and unlimited transactions.
          </p>
          <button 
            onClick={() => setIsUpgradeModalOpen(true)}
            className="w-full py-2 bg-white text-blue-700 text-[11px] font-bold rounded-xl hover:bg-opacity-90 transition-all shadow-sm cursor-pointer"
          >
            Upgrade Now
          </button>
        </div>
      </div>

      <UpgradeModal 
        isOpen={isUpgradeModalOpen} 
        onClose={() => setIsUpgradeModalOpen(false)} 
      />

    </div>
  );
}

export default Sidebar;