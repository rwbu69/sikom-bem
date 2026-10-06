"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, ArrowLeft, Check, X, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
export default function PelamarPanitiaPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;
  const [applications, setApplications] = useState<any[]>([]);
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const fetchData = async () => {
    setLoading(true);
    try {
      const [resEvent, resApp] = await Promise.all([
        fetch(`/api/events`),
        fetch(`/api/committee/applications?eventId=${eventId}`),
      ]);
      const dataEvents = await resEvent.json();
      const currentEvent = dataEvents.find((e: any) => e.id === eventId);
      if (currentEvent) setEvent(currentEvent);
      if (resApp.ok) {
        setApplications(await resApp.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [eventId]);
  const handleUpdateStatus = async (appId: string, status: string) => {
    try {
      const res = await fetch(`/api/committee/applications/${appId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        fetchData();
        setSelectedApp(null);
      } else {
        alert("Gagal mengubah status.");
      }
    } catch (err) {
      alert("Kesalahan jaringan.");
    }
  };
  const filteredData = applications.filter(
    (a) =>
      a.user?.name.toLowerCase().includes(search.toLowerCase()) ||
      a.user?.nim.toLowerCase().includes(search.toLowerCase()) ||
      a.division1?.name.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <div className="space-y-6">
      {" "}
      <div className="flex items-center gap-4 border-b border-border pb-4">
        {" "}
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.push(`/admin/kegiatan/${eventId}/kepanitiaan`)}
          className="h-8 w-8 hover:bg-secondary"
        >
          {" "}
          <ArrowLeft size={16} />{" "}
        </Button>{" "}
        <div>
          {" "}
          <h1 className="text-2xl font-bold text-foreground">
            Dasbor Seleksi: {event?.name || "Memuat..."}
          </h1>{" "}
          <p className="text-sm text-muted-foreground">
            Tinjau alasan pendaftar dan tentukan siapa yang diterima.
          </p>{" "}
        </div>{" "}
      </div>{" "}
      <Card className="border-border shadow-none rounded-md">
        {" "}
        <div className="p-4 border-b border-border bg-surface-muted flex items-center justify-between">
          {" "}
          <div className="relative w-full max-w-sm">
            {" "}
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />{" "}
            <Input
              placeholder="Cari nama, NIM, divisi..."
              className="pl-9 bg-background border-border"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />{" "}
          </div>{" "}
        </div>{" "}
        <CardContent className="p-0 bg-card">
          {" "}
          <Table>
            {" "}
            <TableHeader className="bg-surface-muted">
              {" "}
              <TableRow>
                {" "}
                <TableHead>Mahasiswa</TableHead>{" "}
                <TableHead>Pilihan 1</TableHead>{" "}
                <TableHead>Pilihan 2</TableHead> <TableHead>WA</TableHead>{" "}
                <TableHead>Status</TableHead>{" "}
                <TableHead className="text-right">Aksi</TableHead>{" "}
              </TableRow>{" "}
            </TableHeader>{" "}
            <TableBody>
              {" "}
              {loading ? (
                <TableRow>
                  {" "}
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Memuat data...
                  </TableCell>{" "}
                </TableRow>
              ) : filteredData.length === 0 ? (
                <TableRow>
                  {" "}
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Tidak ada pelamar.
                  </TableCell>{" "}
                </TableRow>
              ) : (
                filteredData.map((app) => (
                  <TableRow key={app.id}>
                    {" "}
                    <TableCell>
                      {" "}
                      <div className="font-medium text-foreground">
                        {app.user.name}
                      </div>{" "}
                      <div className="text-xs text-muted-foreground font-mono">
                        {app.user.nim}
                      </div>{" "}
                    </TableCell>{" "}
                    <TableCell className="font-semibold text-sm">
                      {app.division1.name}
                    </TableCell>{" "}
                    <TableCell className="text-sm text-muted-foreground">
                      {app.division2?.name || "-"}
                    </TableCell>{" "}
                    <TableCell className="text-sm">
                      {" "}
                      <a
                        href={`https://wa.me/${app.whatsapp.replace(/^0/, "62")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {" "}
                        {app.whatsapp}{" "}
                      </a>{" "}
                    </TableCell>{" "}
                    <TableCell>
                      {" "}
                      <span
                        className={`px-2 py-1 text-[10px] font-bold uppercase rounded-md border ${app.status === "PENDING" ? "bg-secondary text-muted-foreground border-border" : app.status === "REJECTED" ? "bg-destructive/10 text-destructive border-red-100" : "bg-emerald-50 text-emerald-700 border-emerald-100"}`}
                      >
                        {" "}
                        {app.status.replace(
                          "ACCEPTED_DIV",
                          "DITERIMA DIV ",
                        )}{" "}
                      </span>{" "}
                    </TableCell>{" "}
                    <TableCell className="text-right">
                      {" "}
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 gap-1.5 text-xs font-semibold hover:bg-indigo-50 border-border"
                        onClick={() => setSelectedApp(app)}
                      >
                        {" "}
                        <Eye size={14} /> Nilai{" "}
                      </Button>{" "}
                    </TableCell>{" "}
                  </TableRow>
                ))
              )}{" "}
            </TableBody>{" "}
          </Table>{" "}
        </CardContent>{" "}
      </Card>{" "}
      <Dialog
        open={!!selectedApp}
        onOpenChange={(open) => !open && setSelectedApp(null)}
      >
        {" "}
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
          {" "}
          {selectedApp && (
            <>
              {" "}
              <div className="bg-surface-muted p-6 border-b border-border">
                {" "}
                <div className="flex items-start justify-between">
                  {" "}
                  <div>
                    {" "}
                    <h2 className="text-xl font-bold text-foreground">
                      {selectedApp.user.name}
                    </h2>{" "}
                    <p className="text-sm text-muted-foreground font-mono">
                      {selectedApp.user.nim}
                    </p>{" "}
                  </div>{" "}
                  <div className="text-right">
                    {" "}
                    <p className="text-xs text-muted-foreground font-bold uppercase mb-1">
                      WA
                    </p>{" "}
                    <a
                      href={`https://wa.me/${selectedApp.whatsapp.replace(/^0/, "62")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-primary hover:underline"
                    >
                      {" "}
                      {selectedApp.whatsapp}{" "}
                    </a>{" "}
                  </div>{" "}
                </div>{" "}
              </div>{" "}
              <div className="p-6 space-y-6">
                {" "}
                <div>
                  {" "}
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                    Alasan Bergabung
                  </h3>{" "}
                  <div className="p-4 bg-surface-muted rounded-md border border-border text-sm leading-relaxed text-foreground italic">
                    {" "}
                    "{selectedApp.reason}"{" "}
                  </div>{" "}
                </div>{" "}
                {selectedApp.experience && (
                  <div>
                    {" "}
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                      Pengalaman / Portofolio / Catatan Khusus
                    </h3>{" "}
                    <div className="p-4 bg-card rounded-md border border-border text-sm whitespace-pre-wrap text-foreground">
                      {" "}
                      {selectedApp.experience}{" "}
                    </div>{" "}
                  </div>
                )}{" "}
                <div className="pt-4 border-t border-border flex gap-3 flex-wrap">
                  {" "}
                  <div className="w-full flex gap-3">
                    {" "}
                    <Button
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                      onClick={() =>
                        handleUpdateStatus(selectedApp.id, "ACCEPTED_DIV1")
                      }
                    >
                      {" "}
                      <Check size={16} className="mr-2" /> Terima di{" "}
                      {selectedApp.division1.name}{" "}
                    </Button>{" "}
                    {selectedApp.division2 && (
                      <Button
                        variant="outline"
                        className="flex-1 border-emerald-600 text-emerald-700 hover:bg-emerald-50"
                        onClick={() =>
                          handleUpdateStatus(selectedApp.id, "ACCEPTED_DIV2")
                        }
                      >
                        {" "}
                        <Check size={16} className="mr-2" /> Terima di{" "}
                        {selectedApp.division2.name}{" "}
                      </Button>
                    )}{" "}
                  </div>{" "}
                  <Button
                    variant="ghost"
                    className="w-full text-destructive hover:bg-destructive/10"
                    onClick={() =>
                      handleUpdateStatus(selectedApp.id, "REJECTED")
                    }
                  >
                    {" "}
                    <X size={16} className="mr-2" /> Tolak (Pesan: Belum bisa
                    bergabung){" "}
                  </Button>{" "}
                </div>{" "}
              </div>{" "}
            </>
          )}{" "}
        </DialogContent>{" "}
      </Dialog>{" "}
    </div>
  );
}
