import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function MainLayout({ children, onLogout }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 text-slate-900 dark:text-white transition-colors duration-300">

      {/* ── Fixed Top Navbar (full width, z-50) ── */}
      <Navbar onLogout={onLogout} />

      {/* ── Body: Sidebar + Content (below navbar) ── */}
      <div className="flex pt-16 min-h-screen">

        {/* ── Fixed Left Sidebar ── */}
        <aside className="hidden md:flex flex-col fixed left-0 top-16 bottom-0 z-40" style={{ width: "200px" }}>
          <Sidebar onLogout={onLogout} />
        </aside>

        {/* ── Main Content (offset sidebar width) ── */}
        <main className="flex-1 min-h-full" style={{ marginLeft: "200px" }}>
          <div className="p-6">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
}

export default MainLayout;