import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";
import { accountsPayableApi } from "@/services/accountsPayableApi";
import { toast } from "@/hooks/use-toast";

const CreatePurchaseOrder = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    po_number: "",
    vendor_id: "",
    items: [],
    total_amount: 0,
    status: "draft" as const,
  });

  const handleSave = async () => {
    try {
      await accountsPayableApi.createPurchaseOrder({
        ...formData,
        vendor_id: parseInt(formData.vendor_id),
      });
      toast({
        title: "Success",
        description: "Purchase Order created successfully",
      });
      navigate('/purchase-orders');
    } catch (error) {
      console.error("Failed to create purchase order:", error);
      toast({
        title: "Error",
        description: "Failed to create purchase order",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-foreground mb-8">Create Purchase Order</h1>
      <Card>
        <CardHeader>
          <CardTitle>Purchase Order Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div><Label htmlFor="po_number">PO Number *</Label><Input id="po_number" value={formData.po_number} onChange={(e) => setFormData({...formData, po_number: e.target.value})} placeholder="Enter PO number" required /></div>
          <div><Label htmlFor="vendor_id">Vendor ID *</Label><Input id="vendor_id" type="number" value={formData.vendor_id} onChange={(e) => setFormData({...formData, vendor_id: e.target.value})} placeholder="Enter vendor ID" required /></div>
          <div><Label htmlFor="total_amount">Total Amount *</Label><Input id="total_amount" type="number" value={formData.total_amount} onChange={(e) => setFormData({...formData, total_amount: parseFloat(e.target.value) || 0})} placeholder="Enter total amount" required /></div>
          <Button onClick={handleSave}><Save className="h-4 w-4 mr-2" />Save Purchase Order</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreatePurchaseOrder;