import React from "react";
import { FiCheck, FiX, FiZap, FiShield, FiTrendingUp } from "react-icons/fi";

function UpgradeModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 ml-[100px]">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-gray-950 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden transform transition-all duration-300 scale-100 opacity-100">
        
        {/* Header Decoration */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600" />
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 dark:text-gray-500 transition-colors z-20"
        >
          <FiX size={20} />
        </button>

        <div className="grid md:grid-cols-2">
          {/* Left: Branding & Benefits */}
          <div className="p-8 bg-blue-50/50 dark:bg-blue-500/5 border-r border-gray-100 dark:border-gray-800">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30">
              <FiZap className="text-white" size={24} />
            </div>
            
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">
              Upgrade to <span className="text-blue-600">Pro</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-8 leading-relaxed">
              Unlock the full potential of your financial data with professional analytics and advanced tools.
            </p>

            <div className="space-y-4">
              {[
                { icon: FiTrendingUp, label: "Advanced predictive analytics" },
                { icon: FiShield, label: "Unlimited historical data" },
                { icon: FiZap, label: "Real-time AI insights" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white dark:bg-gray-900 shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-center text-blue-600">
                    <item.icon size={16} />
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Pricing & CTA */}
          <div className="p-8 flex flex-col">
            <div className="mb-8">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-3 py-1 rounded-full ring-1 ring-blue-500/20">
                Quarterly Plan
              </span>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white">$12.99</span>
                <span className="text-gray-500 dark:text-gray-400 font-medium text-sm">/ month</span>
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Billed annually ($155.88/year)</p>
            </div>

            <ul className="space-y-3 mb-8">
              {[
                "Custom CSV/PDF Exports",
                "Dedicated 24/7 Support",
                "Early access to new features",
                "Remove all platform limits"
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400 font-medium">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <FiCheck size={12} strokeWidth={3} />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>

            <button className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-xl shadow-blue-600/20 hover:scale-[1.02] active:scale-[0.98]">
              Upgrade Now
            </button>
            
            <p className="text-[10px] text-gray-400 dark:text-gray-500 text-center mt-4">
              Cancel anytime. No hidden fees.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpgradeModal;
