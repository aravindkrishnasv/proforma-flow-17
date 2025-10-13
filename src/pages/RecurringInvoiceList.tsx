import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const RecurringInvoiceList = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Recurring Invoices</h1>
        <Link to="/create-recurring-invoice">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Recurring Invoice
          </Button>
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Recurring Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Recurring Invoices functionality is not yet implemented.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecurringInvoiceList;