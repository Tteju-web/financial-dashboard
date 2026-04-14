import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function MainLayout({ children, onLogout }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Close sidebar on navigation (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 text-slate-900 dark:text-white transition-colors duration-300 flex flex-col">

      {/* ── Fixed Top Navbar (z-50) ── */}
      <Navbar onLogout={onLogout} onMenuClick={() => setSidebarOpen(!isSidebarOpen)} />

      {/* ── Outer Wrapper (handles potential overflow) ── */}
      <div className="flex-1 relative">
        
        {/* ── Backdrop for mobile ── */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ── Sidebar (Fixed on Desktop, Slide-over on Mobile) ── */}
        <aside 
          className={`
            fixed top-16 bottom-0 left-0 z-40 w-[200px] transition-transform duration-300 
            bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800
            md:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <Sidebar onLogout={onLogout} onClose={() => setSidebarOpen(false)} />
        </aside>

        {/* ── Main Content Area ── */}
        <main 
          className="flex-1 min-h-full pt-16 transition-all duration-300 md:ml-[200px]"
        >
          <div className="w-full h-full p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default MainLayout;