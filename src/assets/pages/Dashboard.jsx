import { useState } from "react";
import SummaryCards from "../../components/SummaryCards";
import Charts from "../../components/Charts";
import Insights from "../../components/Insights";
import TransactionList from "../../components/TransactionList";
import RoleSwitcher from "../../components/RoleSwitcher";

function Dashboard() {
  const [role, setRole] = useState("viewer");

  return (
    <div>

      {/* <h1 className="text-xl font-semibold mb-4">Dashboard</h1> */}

      {/* Role Switcher */}
      <RoleSwitcher role={role} setRole={setRole} />

      <SummaryCards />
      <Charts />
      <Insights />

      <TransactionList role={role} />

    </div>
  );
}

export default Dashboard;



