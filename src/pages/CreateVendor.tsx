import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save } from "lucide-react";
import { accountsPayableApi } from "@/services/accountsPayableApi";
import { toast } from "@/hooks/use-toast";

const CreateVendor = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    gstin: "",
  });

  const handleSave = async () => {
    if (!formData.name) {
      toast({
        title: "Validation Error",
        description: "Vendor name is required.",
        variant: "destructive",
      });
      return;
    }

    try {
      await accountsPayableApi.createVendor(formData);
      toast({
        title: "Success",
        description: "Vendor created successfully",
      });
      navigate('/vendors');
    } catch (error) {
      console.error("Failed to create vendor:", error);
      toast({
        title: "Error",
        description: "Failed to create vendor",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-foreground mb-8">Create Vendor</h1>
      <Card>
        <CardHeader>
          <CardTitle>Vendor Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div><Label htmlFor="name">Name *</Label><Input id="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Enter vendor name" required /></div>
          <div><Label htmlFor="address">Address</Label><Textarea id="address" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} placeholder="Enter vendor address" rows={3}/></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><Label htmlFor="phone">Phone Number</Label><Input id="phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="Enter phone number"/></div>
            <div><Label htmlFor="email">Email</Label><Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="Enter email address"/></div>
          </div>
          <div><Label htmlFor="gstin">GSTIN</Label><Input id="gstin" value={formData.gstin} onChange={(e) => setFormData({...formData, gstin: e.target.value})} placeholder="Enter GSTIN"/></div>
          <Button onClick={handleSave}><Save className="h-4 w-4 mr-2" />Save Vendor</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateVendor;