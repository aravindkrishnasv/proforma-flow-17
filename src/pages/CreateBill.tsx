import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";
import { accountsPayableApi } from "@/services/accountsPayableApi";
import { toast } from "@/hooks/use-toast";

const CreateBill = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    bill_number: "",
    vendor_id: "",
    purchase_order_id: "",
    bill_date: new Date().toISOString().split('T')[0],
    due_date: "",
    items: [],
    total_amount: 0,
    status: "unpaid" as const,
  });

  const handleSave = async () => {
    try {
      await accountsPayableApi.createBill({
        ...formData,
        vendor_id: parseInt(formData.vendor_id),
        purchase_order_id: parseInt(formData.purchase_order_id),
      });
      toast({
        title: "Success",
        description: "Bill created successfully",
      });
      navigate('/bills');
    } catch (error) {
      console.error("Failed to create bill:", error);
      toast({
        title: "Error",
        description: "Failed to create bill",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-foreground mb-8">Create Bill</h1>
      <Card>
        <CardHeader>
          <CardTitle>Bill Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div><Label htmlFor="bill_number">Bill Number *</Label><Input id="bill_number" value={formData.bill_number} onChange={(e) => setFormData({...formData, bill_number: e.target.value})} placeholder="Enter bill number" required /></div>
          <div><Label htmlFor="vendor_id">Vendor ID *</Label><Input id="vendor_id" type="number" value={formData.vendor_id} onChange={(e) => setFormData({...formData, vendor_id: e.target.value})} placeholder="Enter vendor ID" required /></div>
          <div><Label htmlFor="purchase_order_id">Purchase Order ID *</Label><Input id="purchase_order_id" type="number" value={formData.purchase_order_id} onChange={(e) => setFormData({...formData, purchase_order_id: e.target.value})} placeholder="Enter PO ID" required /></div>
          <div><Label htmlFor="bill_date">Bill Date</Label><Input id="bill_date" type="date" value={formData.bill_date} onChange={(e) => setFormData({...formData, bill_date: e.target.value})} /></div>
          <div><Label htmlFor="due_date">Due Date</Label><Input id="due_date" type="date" value={formData.due_date} onChange={(e) => setFormData({...formData, due_date: e.target.value})} /></div>
          <div><Label htmlFor="total_amount">Total Amount *</Label><Input id="total_amount" type="number" value={formData.total_amount} onChange={(e) => setFormData({...formData, total_amount: parseFloat(e.target.value) || 0})} placeholder="Enter total amount" required /></div>
          <Button onClick={handleSave}><Save className="h-4 w-4 mr-2" />Save Bill</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateBill;