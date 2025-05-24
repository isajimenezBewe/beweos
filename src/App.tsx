import { Route, Routes, Navigate } from "react-router-dom";
import { AppLayout } from "@/layouts/AppLayout";
import { ContactsTable } from "@/pages/contacts/ContactsTable";
import { DealsKanban } from "@/pages/deals/DealsKanban";
import { DealsList } from "@/pages/deals/DealsList";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/contacts" replace />} />
      <Route element={<AppLayout />}>
        {/* <Route path="/home" element={<IndexPage />} /> */}
        <Route path="/contacts" element={<ContactsTable />} />
        <Route path="/deals" element={<DealsKanban />} />
        <Route path="/deals/list" element={<DealsList />} />
      </Route>
    </Routes>
  );
}

export default App;
