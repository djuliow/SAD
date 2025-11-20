"use client";

import { useState, useTransition } from "react";
import { reports } from "@/lib/mockData";
import { generateReport } from "@/lib/mockApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportViewer } from "@/components/cards/report-viewer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export default function AdminReportPage() {
  const [activeType, setActiveType] = useState<"DAILY" | "MONTHLY">("DAILY");
  const [currentReports, setCurrentReports] = useState(reports);
  const [pending, startTransition] = useTransition();

  const handleGenerate = (formData: FormData) => {
    startTransition(async () => {
      try {
        const period = formData.get("period") as string;
        const report = await generateReport(activeType, period);
        toast.success("Laporan dibuat");
        setCurrentReports((prev) => [report, ...prev]);
      } catch (error: any) {
        toast.error(error.message ?? "Gagal membuat laporan");
      }
    });
  };

  const filtered = currentReports.filter((report) => report.type === activeType);

  return (
    <Card>
      <CardHeader className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
        <CardTitle className="text-lg">Laporan Klinik</CardTitle>
        <form className="flex items-center gap-2" action={handleGenerate}>
          <Input
            name="period"
            placeholder={activeType === "DAILY" ? "2025-11-19" : "2025-11"}
            className="w-40"
          />
          <Button className="bg-teal hover:bg-teal/90 text-white shadow-md" disabled={pending} type="submit">
            Generate
          </Button>
        </form>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="DAILY" onValueChange={(value) => setActiveType(value as "DAILY" | "MONTHLY") }>
          <TabsList>
            <TabsTrigger value="DAILY">Harian</TabsTrigger>
            <TabsTrigger value="MONTHLY">Bulanan</TabsTrigger>
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
