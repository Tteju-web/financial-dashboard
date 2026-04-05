import { FiDownload } from "react-icons/fi";

function ExportButton({ data, filename = "transactions_report.csv" }) {
  const handleExport = () => {
    if (!data || !data.length) {
      alert("No data available to export");
      return;
    }

    // 1. Extract headers based on keys of the first item
    const headers = Object.keys(data[0]).join(",");

    // 2. Map data rows ensuring commas in values don't break CSV format
    const csvRows = data.map((row) => {
      return Object.values(row)
        .map((val) => {
          // If value has a comma or quotes, wrap it in double quotes
          const strVal = String(val);
          if (strVal.includes(",") || strVal.includes('"')) {
            return `"${strVal.replace(/"/g, '""')}"`;
          }
          return strVal;
        })
        .join(",");
    });

    // 3. Combine headers and rows
    const csvString = [headers, ...csvRows].join("\n");

    // 4. Create Blob and trigger download
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Revoke the Object URL to free up memory
    setTimeout(() => URL.revokeObjectURL(url), 100);
  };

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl text-sm shadow-lg shadow-blue-500/25 transition-all transform hover:-translate-y-0.5 border border-blue-400/20"
    >
      <FiDownload size={16} /> Export CSV
    </button>
  );
}

export default ExportButton;
