import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus } from "lucide-react";
import { accountsPayableApi } from "@/services/accountsPayableApi";
import { Estimate } from "@/types";
import { Badge } from "@/components/ui/badge";

const EstimateList = () => {
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEstimates = async () => {
      try {
        const data = await accountsPayableApi.getEstimates();
        const formattedData = data.map(estimate => ({
          ...estimate,
          total_amount: parseFloat(estimate.total_amount as any),
        }));
        setEstimates(formattedData);
      } catch (error) {
        console.error("Failed to fetch estimates", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEstimates();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading estimates...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Estimates</h1>
        <Link to="/create-estimate">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Estimate
          </Button>
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Estimates</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Estimate Number</TableHead>
                <TableHead>Customer ID</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {estimates.map((estimate) => (
                <TableRow key={estimate.id}>
                  <TableCell>{estimate.estimate_number}</TableCell>
                  <TableCell>{estimate.customer_id}</TableCell>
                  <TableCell>₹{estimate.total_amount.toFixed(2)}</TableCell>
                  <TableCell><Badge>{estimate.status}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default EstimateList;