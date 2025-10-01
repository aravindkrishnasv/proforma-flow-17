import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Check, X, Undo2 } from "lucide-react";
import { accountsPayableApi } from "@/services/accountsPayableApi";
import { Vendor } from "@/types";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

const VendorList = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVendors = async () => {
    try {
      const data = await accountsPayableApi.getVendors();
      setVendors(data);
    } catch (error) {
      console.error("Failed to fetch vendors", error);
      setError("Failed to fetch vendors. Please ensure the backend server is running and connected to the database.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleUpdateStatus = async (id: number, status: "approved" | "rejected" | "pending") => {
    try {
        await accountsPayableApi.updateVendorStatus(id, status);
        toast({
            title: "Success",
            description: `Vendor status updated to ${status}.`,
        });
        fetchVendors(); // Refresh the list
    } catch (error) {
        console.error("Failed to update vendor status", error);
        toast({
            title: "Error",
            description: "Failed to update vendor status.",
            variant: "destructive",
        });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading vendors...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Vendors</h1>
        <Link to="/create-vendor">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Vendor
          </Button>
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Vendors</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vendors.map((vendor) => (
                <TableRow key={vendor.id}>
                  <TableCell>{vendor.name}</TableCell>
                  <TableCell>{vendor.email}</TableCell>
                  <TableCell>
                    <Badge variant={vendor.status === 'approved' ? 'default' : vendor.status === 'rejected' ? 'destructive' : 'secondary'}>
                        {vendor.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {vendor.status === 'pending' && (
                          <>
                              <Button size="sm" onClick={() => handleUpdateStatus(vendor.id, 'approved')}>
                                  <Check className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => handleUpdateStatus(vendor.id, 'rejected')}>
                                  <X className="h-4 w-4" />
                              </Button>
                          </>
                      )}
                      {vendor.status === 'approved' && (
                          <>
                              <Button size="sm" variant="secondary" onClick={() => handleUpdateStatus(vendor.id, 'pending')}>
                                  <Undo2 className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => handleUpdateStatus(vendor.id, 'rejected')}>
                                  <X className="h-4 w-4" />
                              </Button>
                          </>
                      )}
                      {vendor.status === 'rejected' && (
                          <>
                              <Button size="sm" variant="secondary" onClick={() => handleUpdateStatus(vendor.id, 'pending')}>
                                  <Undo2 className="h-4 w-4" />
                              </Button>
                              <Button size="sm" onClick={() => handleUpdateStatus(vendor.id, 'approved')}>
                                  <Check className="h-4 w-4" />
                              </Button>
                          </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorList;