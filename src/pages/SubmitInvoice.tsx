import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

const SubmitInvoice = () => {
    const [invoiceFile, setInvoiceFile] = useState<File | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setInvoiceFile(event.target.files[0]);
        }
    };

    const handleSubmit = () => {
        if (!invoiceFile) {
            toast({
                title: "Error",
                description: "Please select an invoice file to submit.",
                variant: "destructive",
            });
            return;
        }
        // This is where you would handle the file upload and OCR processing
        toast({
            title: "Success",
            description: "Invoice submitted successfully. It will be processed shortly.",
        });
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-foreground mb-8">Submit Invoice</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Upload Your Invoice</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="invoiceFile">Invoice (PDF, PNG, JPG)</Label>
                        <Input id="invoiceFile" type="file" onChange={handleFileChange} />
                    </div>
                    <Button onClick={handleSubmit}>Submit Invoice</Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default SubmitInvoice;