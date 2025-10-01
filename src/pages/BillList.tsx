import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus } from "lucide-react";
import { accountsPayableApi } from "@/services/accountsPayableApi";
import { Bill } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";

const BillList = () => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBills, setSelectedBills] = useState<number[]>([]);
  const navigate = useNavigate();

  const fetchBills = async () => {
    try {
      const data = await accountsPayableApi.getBills();
      const formattedData = data.map(bill => ({
        ...bill,
        total_amount: parseFloat(bill.total_amount as any),
      }));
      setBills(formattedData);
    } catch (error) {
      console.error("Failed to fetch bills", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const handleBatchPayment = async () => {
    if (selectedBills.length === 0) {
        toast({
            title: "No bills selected",
            description: "Please select bills to pay.",
            variant: "destructive",
        });
        return;
    }

    navigate("/payment", { state: { selectedBills, bills } });
  };

  const handleSelectBill = (id: number) => {
    setSelectedBills(prev => 
        prev.includes(id) ? prev.filter(bId => bId !== id) : [...prev, id]
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading bills...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Bills</h1>
        <div>
          {selectedBills.length > 0 && (
            <Button onClick={handleBatchPayment} className="mr-4">
                <span className="mr-2">₹</span>
                Pay Selected ({selectedBills.length})
            </Button>
          )}
          <Link to="/create-bill">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Bill
            </Button>
          </Link>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Bills</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead>Bill Number</TableHead>
                <TableHead>Vendor ID</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bills.map((bill) => (
                <TableRow key={bill.id}>
                  <TableCell>
                    {bill.status === 'unpaid' && (
                        <Checkbox onCheckedChange={() => handleSelectBill(bill.id)} />
                    )}
                  </TableCell>
                  <TableCell>{bill.bill_number}</TableCell>
                  <TableCell>{bill.vendor_id}</TableCell>
                  <TableCell>{new Date(bill.due_date).toLocaleDateString()}</TableCell>
                  <TableCell>₹{bill.total_amount.toFixed(2)}</TableCell>
                  <TableCell>{bill.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default BillList;