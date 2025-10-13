import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, Save } from "lucide-react";
import { accountsPayableApi } from "@/services/accountsPayableApi";
import { toast } from "@/hooks/use-toast";
import { Customer, EstimateItem } from "@/types";

const CreateEstimate = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [items, setItems] = useState<EstimateItem[]>([]);
  const [estimateNumber, setEstimateNumber] = useState("");
  const [formData, setFormData] = useState({
    customer_id: "",
    estimate_date: new Date().toISOString().split("T")[0],
    expiry_date: "",
    status: "draft" as const,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customersData, estimateCountData] = await Promise.all([
          accountsPayableApi.getCustomers(),
          accountsPayableApi.getEstimateCount(),
        ]);
        setCustomers(customersData);
        const currentYear = new Date().getFullYear();
        const newCount = estimateCountData.count + 1;
        setEstimateNumber(`EST-${currentYear}-${String(newCount).padStart(3, '0')}`);
      } catch (error) {
        console.error("Failed to fetch data", error);
        toast({
          title: "Error",
          description: "Failed to fetch initial data",
          variant: "destructive",
        });
      }
    };
    fetchData();
  }, []);

  const addItem = () => {
    const newItem: EstimateItem = {
      id: Date.now().toString(),
      name: "",
      quantity: 1,
      rate: 0,
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof EstimateItem, value: any) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  };

  const handleSave = async () => {
    if (!estimateNumber || !formData.customer_id || items.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields and add at least one item.",
        variant: "destructive",
      });
      return;
    }

    const estimateData = {
      ...formData,
      estimate_number: estimateNumber,
      customer_id: parseInt(formData.customer_id),
      items,
      total_amount: calculateTotal(),
    };

    try {
      await accountsPayableApi.createEstimate(estimateData);
      toast({
        title: "Success",
        description: "Estimate created successfully",
      });
      navigate('/estimates');
    } catch (error) {
      console.error("Failed to create estimate:", error);
      toast({
        title: "Error",
        description: "Failed to create estimate",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-foreground mb-8">Create Estimate</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Estimate Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div><Label htmlFor="estimate_number">Estimate Number *</Label><Input id="estimate_number" value={estimateNumber} disabled className="bg-muted" /></div>
              <div>
                <Label htmlFor="customer_id">Customer *</Label>
                <Select onValueChange={(value) => setFormData({ ...formData, customer_id: value })} value={formData.customer_id}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map(customer => (
                      <SelectItem key={customer.id} value={String(customer.id)}>{customer.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label htmlFor="estimate_date">Estimate Date</Label><Input id="estimate_date" type="date" value={formData.estimate_date} onChange={(e) => setFormData({ ...formData, estimate_date: e.target.value })}/></div>
                <div><Label htmlFor="expiry_date">Expiry Date</Label><Input id="expiry_date" type="date" value={formData.expiry_date} onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}/></div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between"><CardTitle>Items</CardTitle><Button onClick={addItem} size="sm"><Plus className="h-4 w-4 mr-2" />Add Item</Button></CardHeader>
            <CardContent>
              {items.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No items added yet.</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item Name</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Rate</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell><Input value={item.name} onChange={(e) => updateItem(item.id, 'name', e.target.value)} placeholder="Item name" /></TableCell>
                        <TableCell><Input type="number" value={item.quantity} onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)} min="1" className="w-20" /></TableCell>
                        <TableCell><Input type="number" value={item.rate} onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)} min="0" step="0.01" className="w-24" /></TableCell>
                        <TableCell>₹{(item.quantity * item.rate).toFixed(2)}</TableCell>
                        <TableCell><Button variant="destructive" size="sm" onClick={() => removeItem(item.id)}><Trash2 className="h-4 w-4" /></Button></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Summary</CardTitle></CardHeader>
            <CardContent>
              <div className="flex justify-between font-bold"><span>Total:</span><span>₹{calculateTotal().toFixed(2)}</span></div>
            </CardContent>
          </Card>
          <Button onClick={handleSave} className="w-full"><Save className="h-4 w-4 mr-2" />Save Estimate</Button>
        </div>
      </div>
    </div>
  );
};

export default CreateEstimate;