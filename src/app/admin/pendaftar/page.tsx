"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Download, UserPlus, X, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
export default function PendaftarPage() {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formNim, setFormNim] = useState("");
  const [formName, setFormName] = useState("");
  const [formEventId, setFormEventId] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const fetchData = () => {
    setLoading(true);
    fetch("/api/registrations")
      .then((res) => res.json())
      .then((data) => {
        setRegistrations(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  };
  useEffect(() => {
    fetchData();
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => setEvents(Array.isArray(data) ? data : []));
  }, []);
  const filteredData = registrations.filter(
    (r) =>
      r.user?.name.toLowerCase().includes(search.toLowerCase()) ||
      r.user?.nim.toLowerCase().includes(search.toLowerCase()) ||
      r.event?.name.toLowerCase().includes(search.toLowerCase()),
  );
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setSelectedIds(filteredData.map((r) => r.id));
    else setSelectedIds([]);
  };
  const handleSelectOne = (id: string) => {
    if (selectedIds.includes(id))
      setSelectedIds(selectedIds.filter((i) => i !== id));
    else setSelectedIds([...selectedIds, id]);
  };
  const handleBulkAction = async (status: string) => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Tandai ${selectedIds.length} pendaftar sebagai ${status}?`))
      return;
    try {
      const res = await fetch("/api/registrations/bulk", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds, status }),
      });
      const data = await res.json();
      alert(data.message);
      if (res.ok) {
        setSelectedIds([]);
        fetchData();
      }
    } catch (err) {
      alert("Kesalahan jaringan");
    }
  };
  const exportToExcel = () => {
    const dataToExport = filteredData.map((reg) => ({
      NIM: reg.user?.nim,
      Nama: reg.user?.name,
      Kegiatan: reg.event?.name,
      "Waktu Daftar": new Date(reg.createdAt).toLocaleString("id-ID"),
      Status: reg.status,
    }));
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Pendaftar");
    XLSX.writeFile(workbook, "Data_Pendaftar_SIKOM.xlsx");
  };
  const handleManualRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError("");
    try {
      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nim: formNim,
          name: formName,
          eventId: formEventId,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setIsModalOpen(false);
        setFormNim("");
        setFormName("");
        setFormEventId("");
        fetchData();
      } else {
        setFormError(data.message || "Gagal menambahkan peserta.");
      }
    } catch (err) {
      setFormError("Kesalahan koneksi ke server.");
    } finally {
      setFormLoading(false);
    }
  };
  return (
    <div className="space-y-6">
      {" "}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-4">
        {" "}
        <div>
          {" "}
          <h1 className="text-2xl font-heading text-foreground mb-1">
            Data Pendaftar
          </h1>{" "}
          <p className="text-sm text-muted-foreground">
            Kelola mahasiswa yang mendaftar ke berbagai kegiatan.
          </p>{" "}
        </div>{" "}
        <div className="flex gap-2 w-full sm:w-auto">
          {" "}
          <Button
            variant="outline"
            className="gap-2 flex-1 sm:flex-none border-border"
            onClick={exportToExcel}
          >
            {" "}
            <Download size={16} /> Ekspor Excel{" "}
          </Button>{" "}
          <Button
            className="gap-2 flex-1 sm:flex-none"
            onClick={() => setIsModalOpen(true)}
          >
            {" "}
            <UserPlus size={16} /> Tambah Manual{" "}
          </Button>{" "}
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
              placeholder="Cari nama, NIM, atau kegiatan..."
              className="pl-9 bg-background border-border"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />{" "}
          </div>{" "}
          {selectedIds.length > 0 && (
            <div className="flex gap-2">
              {" "}
              <span className="text-sm font-medium self-center mr-2">
                {selectedIds.length} dipilih
              </span>{" "}
              <Button
                size="sm"
                variant="outline"
                className="border-emerald-500/20 text-emerald-600 hover:bg-emerald-50"
                onClick={() => handleBulkAction("CONFIRMED")}
              >
                {" "}
                Terima{" "}
              </Button>{" "}
              <Button
                size="sm"
                variant="outline"
                className="border-destructive/20 text-destructive hover:bg-destructive/10"
                onClick={() => handleBulkAction("REJECTED")}
              >
                {" "}
                Tolak{" "}
              </Button>{" "}
            </div>
          )}{" "}
        </div>{" "}
        <CardContent className="p-0 bg-card">
          {" "}
          <Table>
            {" "}
            <TableHeader className="bg-surface-muted">
              {" "}
              <TableRow className="border-border">
                {" "}
                <TableHead className="w-12 text-center">
                  {" "}
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={
                      filteredData.length > 0 &&
                      selectedIds.length === filteredData.length
                    }
                    className="w-4 h-4 cursor-pointer accent-primary"
                  />{" "}
                </TableHead>{" "}
                <TableHead className="font-semibold text-foreground">
                  NIM
                </TableHead>{" "}
                <TableHead className="font-semibold text-foreground">
                  Nama Mahasiswa
                </TableHead>{" "}
                <TableHead className="font-semibold text-foreground">
                  Kegiatan
                </TableHead>{" "}
                <TableHead className="font-semibold text-foreground">
                  Waktu Daftar
                </TableHead>{" "}
                <TableHead className="font-semibold text-foreground">
                  Status
                </TableHead>{" "}
              </TableRow>{" "}
            </TableHeader>{" "}
            <TableBody>
              {" "}
              {loading ? (
                <TableRow>
                  {" "}
                  <TableCell
                    colSpan={5}
                    className="h-24 text-center text-muted-foreground font-medium"
                  >
                    Memuat data...
                  </TableCell>{" "}
                </TableRow>
              ) : filteredData.length === 0 ? (
                <TableRow>
                  {" "}
                  <TableCell
                    colSpan={5}
                    className="h-24 text-center text-muted-foreground font-medium"
                  >
                    Tidak ada data pendaftar
                  </TableCell>{" "}
                </TableRow>
              ) : (
                filteredData.map((reg) => (
                  <TableRow
                    key={reg.id}
                    className="border-border hover:bg-surface-muted/50"
                  >
                    {" "}
                    <TableCell className="text-center">
                      {" "}
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(reg.id)}
                        onChange={() => handleSelectOne(reg.id)}
                        className="w-4 h-4 cursor-pointer accent-primary"
                      />{" "}
                    </TableCell>{" "}
                    <TableCell className="font-mono text-sm text-foreground">
                      {reg.user?.nim}
                    </TableCell>{" "}
                    <TableCell className="font-medium text-foreground">
                      {reg.user?.name}
                    </TableCell>{" "}
                    <TableCell>
                      {" "}
                      <div className="flex flex-col">
                        {" "}
                        <span className="text-sm font-semibold text-foreground">
                          {reg.event?.name}
                        </span>{" "}
                        <span className="text-xs font-mono text-muted-foreground">
                          {reg.event?.code}
                        </span>{" "}
                      </div>{" "}
                    </TableCell>{" "}
                    <TableCell className="text-muted-foreground text-sm">
                      {" "}
                      {new Date(reg.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                    </TableCell>{" "}
                    <TableCell>
                      {" "}
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded border text-xs font-semibold ${reg.status === "CONFIRMED" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : reg.status === "REJECTED" ? "border-destructive/20 bg-destructive/10 text-destructive" : reg.status === "CANCELED" ? "border-border bg-secondary text-muted-foreground" : "border-border bg-surface-muted text-foreground"}`}
                      >
                        {" "}
                        {reg.status}{" "}
                      </span>{" "}
                    </TableCell>{" "}
                  </TableRow>
                ))
              )}{" "}
            </TableBody>{" "}
          </Table>{" "}
        </CardContent>{" "}
      </Card>{" "}
      {/* Modal Tambah Manual */}{" "}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          {" "}
          <div className="bg-card w-full max-w-md rounded-md border border-border">
            {" "}
            <div className="flex items-center justify-between p-4 border-b border-border">
              {" "}
              <h2 className="text-lg font-heading text-foreground">
                Registrasi Manual
              </h2>{" "}
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                {" "}
                <X size={20} />{" "}
              </button>{" "}
            </div>{" "}
            <form onSubmit={handleManualRegistration} className="p-4 space-y-4">
              {" "}
              {formError && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded flex items-center gap-2">
                  {" "}
                  <AlertCircle size={16} /> <span>{formError}</span>{" "}
                </div>
              )}{" "}
              <div className="space-y-1.5">
                {" "}
                <label className="text-sm font-semibold text-foreground">
                  Pilih Kegiatan
                </label>{" "}
                <select
                  required
                  value={formEventId}
                  onChange={(e) => setFormEventId(e.target.value)}
                  className="w-full h-10 bg-background border border-border rounded-md px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {" "}
                  <option value="" disabled>
                    Pilih kegiatan aktif...
                  </option>{" "}
                  {events
                    .filter((e) => e.status !== "DRAFT")
                    .map((event) => (
                      <option key={event.id} value={event.id}>
                        {event.name}
                      </option>
                    ))}{" "}
                </select>{" "}
              </div>{" "}
              <div className="space-y-1.5">
                {" "}
                <label className="text-sm font-semibold text-foreground">
                  NIM
                </label>{" "}
                <Input
                  required
                  value={formNim}
                  onChange={(e) => setFormNim(e.target.value)}
                  placeholder="Contoh: 12345678"
                  className="font-mono bg-background border-border"
                />{" "}
              </div>{" "}
              <div className="space-y-1.5">
                {" "}
                <label className="text-sm font-semibold text-foreground">
                  Nama Lengkap
                </label>{" "}
                <Input
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Sesuai KTP/KTM"
                  className="bg-background border-border"
                />{" "}
              </div>{" "}
              <div className="pt-2">
                {" "}
                <Button
                  type="submit"
                  className="w-full font-semibold"
                  disabled={formLoading}
                >
                  {" "}
                  {formLoading ? "Menyimpan..." : "Daftarkan Peserta"}{" "}
                </Button>{" "}
                <p className="text-xs text-muted-foreground text-center mt-3">
                  {" "}
                  Akun akan otomatis dibuat jika NIM belum terdaftar (Sandi
                  Default: NIM).{" "}
                </p>{" "}
              </div>{" "}
            </form>{" "}
          </div>{" "}
        </div>
      )}{" "}
    </div>
  );
}
