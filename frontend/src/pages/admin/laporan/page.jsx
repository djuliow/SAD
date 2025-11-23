
import { useState, useTransition } from "react";
import { reports } from "/src/lib/mockData";
import { generateReport } from "/src/api/api.js";
import { Card, CardContent, CardHeader, CardTitle } from "/src/components/ui/card";
import { ReportViewer } from "/src/components/cards/report-viewer";
import { Button } from "/src/components/ui/button";
import { Input } from "/src/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "/src/components/ui/tabs";
import { toast } from "sonner";

export default function AdminReportPage() {
  const [activeType, setActiveType] = useState("DAILY");
  const [currentReports, setCurrentReports] = useState(reports);
  const [pending, startTransition] = useTransition();

  const handleGenerate = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    startTransition(async () => {
      try {
        const period = formData.get("period");
        const report = await generateReport(activeType, period);
        toast.success("Laporan dibuat");
        setCurrentReports((prev) => [report, ...prev]);
      } catch (error) {
        toast.error(error.message ?? "Gagal membuat laporan");
      }
    });
  };

  const filtered = currentReports.filter((report) => report.type === activeType);

  return (
    <Card className="bg-white border border-navy/10 shadow-md">
      <CardHeader className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between bg-beige border-b border-navy/10">
        <CardTitle className="text-lg font-bold text-navy">Laporan Klinik</CardTitle>
        <form className="flex items-center gap-2" onSubmit={handleGenerate}>
          <Input
            name="period"
            placeholder={activeType === "DAILY" ? "2025-11-19" : "2025-11"}
            className="w-40"
          />
          <Button className="bg-teal hover:bg-teal/90 text-white shadow-sm" disabled={pending} type="submit">
            Generate
          </Button>
        </form>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs defaultValue="DAILY" onValueChange={(value) => setActiveType(value) }>
          <TabsList className="bg-beige rounded-full p-1 inline-flex mb-6">
            <TabsTrigger 
              value="DAILY" 
              className="rounded-full px-6 py-2 text-sm font-medium transition-all data-[state=active]:bg-teal data-[state=active]:text-white data-[state=active]:shadow-sm text-navy hover:bg-teal/10"
            >
              Harian
            </TabsTrigger>
            <TabsTrigger 
              value="MONTHLY" 
              className="rounded-full px-6 py-2 text-sm font-medium transition-all data-[state=active]:bg-teal data-[state=active]:text-white data-[state=active]:shadow-sm text-navy hover:bg-teal/10"
            >
              Bulanan
            </TabsTrigger>
          </TabsList>
          <TabsContent value="DAILY">
            <div className="grid gap-4 md:grid-cols-2">
              {filtered.map((report) => (
                <ReportViewer key={report.id} report={report} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="MONTHLY">
            <div className="grid gap-4 md:grid-cols-2">
              {filtered.map((report) => (
                <ReportViewer key={report.id} report={report} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
