"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";
import {
  MonitorPlay,
  ScanLine,
  ListChecks,
  Users,
  Download,
} from "lucide-react";
import QRScanner from "./Scanner";
import { toast } from "sonner";
import * as XLSX from "xlsx";
export default function PresensiDashboard() {
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [mode, setMode] = useState<"PROYEKTOR" | "SCANNER" | "KOREKSI">(
    "PROYEKTOR",
  );
  const [qrToken, setQrToken] = useState("");
  const [timer, setTimer] = useState(10);
  const [origin, setOrigin] = useState("");
  const [stats, setStats] = useState({
    totalRegistered: 0,
    totalAttended: 0,
    recentAttendees: [] as any[],
  });
  const [manualNim, setManualNim] = useState("");
  const [manualAction, setManualAction] = useState<"ADD" | "REMOVE">("ADD");
  const [isExporting, setIsExporting] = useState(false);
  const handleExportExcel = async () => {
    if (!selectedEventId) return;
    setIsExporting(true);
    try {
      toast.info("Menyiapkan file ekspor...");
      const res = await fetch(
        `/api/attendance/export?eventId=${selectedEventId}`,
      );
      if (!res.ok) throw new Error("Gagal mengambil data");
      const data = await res.json();
      if (data.length === 0) {
        toast.warning("Belum ada presensi untuk acara ini.");
        setIsExporting(false);
        return;
      }
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Presensi");
      const eventName =
        events.find((e) => e.id === selectedEventId)?.name || "Kegiatan";
      XLSX.writeFile(
        workbook,
        `Presensi_${eventName.replace(/\s+/g, "_")}.xlsx`,
      );
      toast.success("Berhasil mengekspor presensi!");
    } catch (e) {
      toast.error("Gagal mengekspor data.");
    } finally {
      setIsExporting(false);
    }
  };
  useEffect(() => {
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => setEvents(data.filter((e: any) => e.status !== "DRAFT")));
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);
  useEffect(() => {
    if (mode !== "PROYEKTOR" || !selectedEventId) return;
    const fetchToken = async () => {
      try {
        const res = await fetch(
          `/api/attendance/token?eventId=${selectedEventId}`,
        );
        const data = await res.json();
        if (data.token) {
          setQrToken(data.token);
          setTimer(10);
        }
      } catch (e) {
        console.error(e);
      }
    };
    const fetchStats = async () => {
      try {
        const res = await fetch(
          `/api/attendance/stats?eventId=${selectedEventId}`,
        );
        const data = await res.json();
        if (res.ok) setStats(data);
      } catch (e) {
        console.error(e);
      }
    };
    if (mode === "PROYEKTOR") fetchToken();
    fetchStats();
    const intervalId = setInterval(() => {
      if (mode === "PROYEKTOR") fetchToken();
      fetchStats();
    }, 10000);
    const countdownId = setInterval(
      () => setTimer((prev) => (prev > 0 ? prev - 1 : 10)),
      1000,
    );
    return () => {
      clearInterval(intervalId);
      clearInterval(countdownId);
    };
  }, [mode, selectedEventId]);
  const qrUrl = `${origin}/absen?token=${qrToken}`;
  return (
    <div className="space-y-6 w-full">
      {" "}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between border-b border-border pb-4">
        {" "}
        <div>
          {" "}
          <h1 className="text-2xl font-heading text-foreground mb-1">
            Presensi QR
          </h1>{" "}
          <p className="text-sm text-muted-foreground">
            Proyeksi QR atau gunakan scanner manual.
          </p>{" "}
        </div>{" "}
        <div className="flex bg-surface-muted p-1 rounded-md w-full md:w-auto border border-border">
          {" "}
          <button
            onClick={() => setMode("PROYEKTOR")}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded font-medium text-sm transition-colors ${mode === "PROYEKTOR" ? "bg-background text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            {" "}
            <MonitorPlay className="w-4 h-4" /> Proyektor{" "}
          </button>{" "}
          <button
            onClick={() => setMode("SCANNER")}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded font-medium text-sm transition-colors ${mode === "SCANNER" ? "bg-background text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            {" "}
            <ScanLine className="w-4 h-4" /> Scanner{" "}
          </button>{" "}
          <button
            onClick={() => setMode("KOREKSI")}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded font-medium text-sm transition-colors ${mode === "KOREKSI" ? "bg-background text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            {" "}
            <ListChecks className="w-4 h-4" /> Koreksi Manual{" "}
          </button>{" "}
        </div>{" "}
      </div>{" "}
      <div className="bg-card border border-border p-4 rounded-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {" "}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
          {" "}
          <label className="text-sm font-semibold text-foreground whitespace-nowrap">
            Kegiatan Aktif:
          </label>{" "}
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="w-full sm:w-64 h-10 bg-background border border-border text-sm font-medium rounded-md px-3 appearance-none focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {" "}
            <option value="" disabled>
              Pilih kegiatan...
            </option>{" "}
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {" "}
                {event.name} ({event.code}){" "}
              </option>
            ))}{" "}
          </select>{" "}
        </div>{" "}
        {selectedEventId && (
          <div className="flex items-center gap-4 w-full md:w-auto">
            {" "}
            <Button
              onClick={handleExportExcel}
              variant="outline"
              className="gap-2 bg-card hover:bg-surface-muted"
              disabled={isExporting}
            >
              {" "}
              <Download className="w-4 h-4" />{" "}
              {isExporting ? "Mengekspor..." : "Ekspor Excel"}{" "}
            </Button>{" "}
            <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 text-primary rounded-md">
              {" "}
              <Users className="w-4 h-4" />{" "}
              <span className="text-sm font-bold tracking-wide">
                {" "}
                Hadir: {stats.totalAttended} / {stats.totalRegistered}{" "}
                Pendaftar{" "}
              </span>{" "}
            </div>{" "}
          </div>
        )}{" "}
      </div>{" "}
      {mode === "PROYEKTOR" && selectedEventId && qrToken && (
        <div className="py-8">
          {" "}
          <div className="bg-card rounded-md border border-border overflow-hidden grid grid-cols-1 md:grid-cols-2 ">
            {" "}
            <div className="p-10 md:p-14 flex flex-col justify-center items-center md:items-start text-center md:text-left bg-surface-muted/50 border-b md:border-b-0 md:border-r border-border">
              {" "}
              <h2 className="text-3xl md:text-4xl font-heading text-foreground mb-4">
                Pindai untuk Hadir
              </h2>{" "}
              <p className="text-muted-foreground md:text-lg mb-8 max-w-sm">
                {" "}
                Buka scanner pada aplikasi absensi atau kamera ponsel Anda dan
                arahkan ke QR Code di samping.{" "}
              </p>{" "}
              <div className="inline-flex items-center justify-center text-sm font-medium font-mono bg-background text-foreground px-5 py-3 border border-border rounded-md ">
                {" "}
                Akan diperbarui dalam:{" "}
                <span className="text-primary font-bold ml-2">
                  {timer} detik
                </span>{" "}
              </div>{" "}
            </div>{" "}
            <div className="p-10 md:p-14 flex flex-col items-center justify-center bg-card">
              {" "}
              <div className="bg-card p-4 md:p-6 border border-border rounded-md mb-4 transition-all duration-300">
                {" "}
                <QRCodeSVG
                  value={qrUrl}
                  size={320}
                  className="w-full max-w-[250px] md:max-w-[320px] h-auto"
                />{" "}
              </div>{" "}
              <p className="text-xs text-muted-foreground font-mono opacity-60">
                {" "}
                Token: {qrToken.substring(0, 16)}...{" "}
              </p>{" "}
            </div>{" "}
          </div>{" "}
        </div>
      )}{" "}
      {mode === "SCANNER" && selectedEventId && (
        <div className="max-w-xl mx-auto py-8">
          {" "}
          <div className="bg-black p-6 rounded-md flex flex-col items-center border border-border">
            {" "}
            <div className="text-primary-foreground text-xs font-semibold mb-4 uppercase tracking-widest flex items-center gap-2">
              {" "}
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>{" "}
              Kamera Aktif{" "}
            </div>{" "}
            <QRScanner
              onScan={(text) => {
                alert(
                  "Token Scan: " +
                    text +
                    " | (Catatan: Ini butuh auth jika API tidak dipisah. Pastikan scan via HP mahasiswa)",
                );
              }}
            />{" "}
          </div>{" "}
        </div>
      )}{" "}
      {mode === "KOREKSI" && selectedEventId && (
        <div className="py-6 max-w-2xl mx-auto space-y-6">
          {" "}
          <div className="bg-card border border-border p-6 rounded-md ">
            {" "}
            <h3 className="text-lg font-heading text-foreground mb-4">
              Input Koreksi Presensi
            </h3>{" "}
            <div className="flex flex-col sm:flex-row gap-3">
              {" "}
              <input
                type="text"
                placeholder="Masukkan NIM Mahasiswa..."
                value={manualNim}
                onChange={(e) => setManualNim(e.target.value)}
                className="flex-1 h-10 bg-background border border-border px-3 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />{" "}
              <select
                value={manualAction}
                onChange={(e) =>
                  setManualAction(e.target.value as "ADD" | "REMOVE")
                }
                className="w-full sm:w-32 h-10 bg-background border border-border px-3 rounded-md text-sm"
              >
                {" "}
                <option value="ADD">Hadirkan</option>{" "}
                <option value="REMOVE">Hapus</option>{" "}
              </select>{" "}
              <Button
                onClick={async () => {
                  if (!manualNim) return;
                  try {
                    const res = await fetch("/api/attendance/manual", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        nim: manualNim,
                        eventId: selectedEventId,
                        action: manualAction,
                      }),
                    });
                    const data = await res.json();
                    if (res.ok) {
                      toast.success(data.message);
                      setManualNim("");
                      const statsRes = await fetch(
                        `/api/attendance/stats?eventId=${selectedEventId}`,
                      );
                      const statsData = await statsRes.json();
                      setStats(statsData);
                    } else {
                      toast.error(data.message);
                    }
                  } catch (e) {
                    toast.error("Kesalahan jaringan.");
                  }
                }}
              >
                Eksekusi
              </Button>{" "}
            </div>{" "}
            <p className="text-xs text-muted-foreground mt-4">
              Setiap tindakan koreksi manual ini akan dicatat dalam Audit Log.
            </p>{" "}
          </div>{" "}
          <div className="bg-card border border-border rounded-md overflow-hidden">
            {" "}
            <div className="p-4 bg-surface-muted border-b border-border">
              {" "}
              <h4 className="font-semibold text-foreground text-sm">
                5 Kehadiran Terakhir
              </h4>{" "}
            </div>{" "}
            <div className="divide-y divide-border">
              {" "}
              {stats.recentAttendees.length === 0 ? (
                <div className="p-6 text-center text-sm text-muted-foreground">
                  Belum ada peserta yang hadir.
                </div>
              ) : (
                stats.recentAttendees.map((att) => (
                  <div
                    key={att.id}
                    className="p-4 flex items-center justify-between hover:bg-surface-muted/30"
                  >
                    {" "}
                    <div>
                      {" "}
                      <p className="text-sm font-medium text-foreground">
                        {att.user.name}
                      </p>{" "}
                      <p className="text-xs font-mono text-muted-foreground">
                        {att.user.nim}
                      </p>{" "}
                    </div>{" "}
                    <div className="text-xs text-muted-foreground">
                      {" "}
                      {new Date(att.timestamp).toLocaleTimeString("id-ID")}{" "}
                    </div>{" "}
                  </div>
                ))
              )}{" "}
            </div>{" "}
          </div>{" "}
        </div>
      )}{" "}
      {!selectedEventId && (
        <div className="py-20 flex flex-col items-center justify-center text-muted-foreground bg-surface-muted rounded-md border border-dashed border-border">
          {" "}
          <MonitorPlay className="w-10 h-10 mb-2 opacity-50" />{" "}
          <p className="text-sm font-medium">
            Pilih kegiatan terlebih dahulu.
          </p>{" "}
        </div>
      )}{" "}
    </div>
  );
}
