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
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 text-slate-900 dark:text-white transition-colors duration-300">

      {/* ── Fixed Top Navbar (full width, z-50) ── */}
      <Navbar onLogout={onLogout} onMenuClick={() => setSidebarOpen(!isSidebarOpen)} />

      {/* ── Body: Sidebar + Content (below navbar) ── */}
      <div className="flex pt-16 min-h-screen">

        {/* ── Backdrop for mobile ── */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ── Responsive Sidebar ── */}
        <aside 
          className={`
            fixed top-16 bottom-0 left-0 z-40 w-[200px] transition-transform duration-300 bg-white dark:bg-gray-900
            md:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <Sidebar onLogout={onLogout} onClose={() => setSidebarOpen(false)} />
        </aside>

        {/* ── Main Content (offset sidebar width on desktop) ── */}
        <main className="flex-1 min-h-full transition-all duration-300 md:ml-[200px]">
          <div className="p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
}

export default MainLayout;