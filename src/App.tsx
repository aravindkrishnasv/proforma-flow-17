import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/layout/Header";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import CreateInvoice from "./pages/CreateInvoice";
import InvoiceList from "./pages/InvoiceList";
import NotFound from "./pages/NotFound";
import InvoiceDetail from "./pages/InvoiceDetail";
import EditInvoice from "./pages/EditInvoice";
import VendorList from "./pages/VendorList";
import CreateVendor from "./pages/CreateVendor";
import PurchaseOrderList from "./pages/PurchaseOrderList";
import CreatePurchaseOrder from "./pages/CreatePurchaseOrder";
import BillList from "./pages/BillList";
import CreateBill from "./pages/CreateBill";
import VendorPortal from "./pages/VendorPortal";
import VendorOnboarding from "./pages/VendorOnboarding";
import SubmitInvoice from "./pages/SubmitInvoice";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/create-invoice" element={<CreateInvoice />} />
              <Route path="/invoices" element={<InvoiceList />} />
              <Route path="/invoices/:id" element={<InvoiceDetail />} />
              <Route path="/edit-invoice/:id" element={<EditInvoice />} />
              <Route path="/vendors" element={<VendorList />} />
              <Route path="/create-vendor" element={<CreateVendor />} />
              <Route path="/purchase-orders" element={<PurchaseOrderList />} />
              <Route path="/create-purchase-order" element={<CreatePurchaseOrder />} />
              <Route path="/bills" element={<BillList />} />
              <Route path="/create-bill" element={<CreateBill />} />
              <Route path="/vendor-portal" element={<VendorPortal />} />
              <Route path="/vendor-onboarding" element={<VendorOnboarding />} />
              <Route path="/submit-invoice" element={<SubmitInvoice />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;