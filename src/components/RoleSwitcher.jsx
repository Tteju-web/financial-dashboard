function RoleSwitcher({ role, setRole }) {
  return (
    <div className="mb-4">
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="bg-white dark:bg-gray-800 text-slate-900 dark:text-white p-2 rounded border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm font-medium"
      >
        <option value="viewer" className="bg-white dark:bg-gray-800">Viewer</option>
        <option value="admin" className="bg-white dark:bg-gray-800">Admin</option>
      </select>
    </div>
  );
}

export default RoleSwitcher;