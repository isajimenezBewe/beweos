import { Route, Routes, Navigate } from "react-router-dom";
import { AppLayout } from "@/layouts/AppLayout";
import IndexPage from "@/pages/index";
import { ContactsTable } from "@/pages/contacts/ContactsTable";
import { DealsKanban } from "@/pages/deals/DealsKanban";
import { DealsList } from "@/pages/deals/DealsList";
import TestThemePage from "@/pages/test-theme";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route element={<AppLayout />}>
        <Route path="/home" element={<IndexPage />} />
        <Route path="/contacts" element={<ContactsTable />} />
        <Route path="/deals" element={<DealsKanban />} />
        <Route path="/deals/list" element={<DealsList />} />
        <Route path="/test-theme" element={<TestThemePage />} />
      </Route>
    </Routes>
  );
}

export default App;
