"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FileText,
  Upload,
  Download,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
export default function ArsipPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [docType, setDocType] = useState("LPJ");
  const [documents, setDocuments] = useState<any[]>([]);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);
  useEffect(() => {
    fetch("/api/events")
      .then((res) => res.json())
      .then(setEvents);
    fetchDocuments();
  }, []);
  const fetchDocuments = () => {
    fetch("/api/documents")
      .then((res) => res.json())
      .then(setDocuments);
  };
  const updateStatus = async (id: string, status: "APPROVED" | "REJECTED") => {
    try {
      const res = await fetch(`/api/documents/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (res.ok) {
        fetchDocuments();
      } else {
        alert(data.message);
      }
    } catch (e) {
      alert("Kesalahan jaringan");
    }
  };
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !selectedEventId) {
      setFeedback({
        type: "error",
        msg: "Pilih acara dan berkas terlebih dahulu.",
      });
      return;
    }
    setUploading(true);
    setFeedback(null);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("eventId", selectedEventId);
    formData.append("type", docType);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setFeedback({ type: "success", msg: "Berkas berhasil diunggah." });
        setFile(null);
        fetchDocuments();
      } else {
        setFeedback({
          type: "error",
          msg: data.message || "Gagal mengunggah berkas.",
        });
      }
    } catch (e) {
      setFeedback({ type: "error", msg: "Kesalahan jaringan." });
    } finally {
      setUploading(false);
    }
  };
  return (
    <div className="space-y-6">
      {" "}
      <div className="border-b border-border pb-4">
        {" "}
        <h1 className="text-2xl font-heading text-foreground mb-1">
          Arsip & Dokumentasi
        </h1>{" "}
        <p className="text-sm text-muted-foreground">
          Pusat unggah dan unduh dokumen LPJ atau Proposal kegiatan.
        </p>{" "}
      </div>{" "}
      <div className="grid gap-6 lg:grid-cols-12">
        {" "}
        {/* KIRI: Form Upload */}{" "}
        <Card className="lg:col-span-5 rounded-md shadow-none border-border h-max">
          {" "}
          <CardHeader className="pb-4">
            {" "}
            <CardTitle className="text-lg">Unggah Dokumen</CardTitle>{" "}
          </CardHeader>{" "}
          <CardContent>
            {" "}
            <form onSubmit={handleUpload} className="space-y-4">
              {" "}
              <div className="space-y-1.5">
                {" "}
                <label className="text-sm font-semibold text-foreground">
                  Kegiatan
                </label>{" "}
                <select
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                  className="w-full h-10 bg-background border border-border rounded-md px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {" "}
                  <option value="" disabled>
                    Pilih kegiatan...
                  </option>{" "}
                  {events.map((event) => (
                    <option key={event.id} value={event.id}>
                      {event.name}
                    </option>
                  ))}{" "}
                </select>{" "}
              </div>{" "}
              <div className="space-y-1.5">
                {" "}
                <label className="text-sm font-semibold text-foreground">
                  Jenis Dokumen
                </label>{" "}
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="w-full h-10 bg-background border border-border rounded-md px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {" "}
                  <option value="PROPOSAL">Proposal</option>{" "}
                  <option value="LPJ">LPJ</option>{" "}
                  <option value="DOKUMENTASI">
                    Dokumentasi (ZIP/Gambar)
                  </option>{" "}
                </select>{" "}
              </div>{" "}
              <div className="border border-dashed border-border rounded-md p-6 text-center bg-surface-muted">
                {" "}
                <Input
                  type="file"
                  className="hidden"
                  id="file-upload"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  accept=".pdf,.png,.jpg,.jpeg,.docx,.zip"
                />{" "}
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  {" "}
                  <Upload className="h-6 w-6 text-muted-foreground mb-2" />{" "}
                  <span className="text-sm font-semibold text-foreground">
                    {" "}
                    {file ? file.name : "Pilih Berkas"}{" "}
                  </span>{" "}
                  <span className="text-xs text-muted-foreground mt-1">
                    Maks 10MB
                  </span>{" "}
                </label>{" "}
              </div>{" "}
              {feedback && (
                <div
                  className={`p-3 text-sm rounded-md flex items-start gap-2 border ${feedback.type === "success" ? "bg-primary/10 text-primary border-primary/20" : "bg-destructive/10 text-destructive border-destructive/20"}`}
                >
                  {" "}
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />{" "}
                  <span>{feedback.msg}</span>{" "}
                </div>
              )}{" "}
              <Button
                type="submit"
                className="w-full h-10 rounded-md font-semibold"
                disabled={!file || !selectedEventId || uploading}
              >
                {" "}
                {uploading ? "Mengunggah..." : "Unggah"}{" "}
              </Button>{" "}
            </form>{" "}
          </CardContent>{" "}
        </Card>{" "}
        {/* KANAN: Daftar Dokumen */}{" "}
        <Card className="lg:col-span-7 bg-card rounded-md shadow-none border-border">
          {" "}
          <CardHeader className="pb-4">
            {" "}
            <CardTitle className="text-lg">Daftar Arsip</CardTitle>{" "}
          </CardHeader>{" "}
          <CardContent>
            {" "}
            {documents.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-center text-muted-foreground border border-dashed border-border rounded-md">
                {" "}
                <p className="text-sm">Tidak ada arsip yang ditemukan.</p>{" "}
              </div>
            ) : (
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {" "}
                {documents.map((doc: any) => (
                  <div
                    key={doc.id}
                    className="p-4 rounded-md border border-border bg-background hover:bg-surface-muted flex items-start justify-between gap-3"
                  >
                    {" "}
                    <div className="flex items-start gap-3">
                      {" "}
                      <FileText className="w-5 h-5 text-muted-foreground mt-0.5" />{" "}
                      <div>
                        {" "}
                        <p className="text-sm font-semibold text-foreground leading-tight">
                          {doc.event?.name}
                        </p>{" "}
                        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mt-1">
                          {" "}
                          <span className="font-mono">{doc.type}</span>{" "}
                          <span>•</span> <span>{doc.uploader?.name}</span>{" "}
                          <span>•</span>{" "}
                          <span>
                            {new Date(doc.createdAt).toLocaleDateString(
                              "id-ID",
                            )}
                          </span>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className="flex items-center gap-2">
                      {" "}
                      {doc.status === "DRAFT" || doc.status === "SUBMITTED" ? (
                        <>
                          {" "}
                          <button
                            onClick={() => updateStatus(doc.id, "APPROVED")}
                            className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-md"
                            title="Setujui"
                          >
                            {" "}
                            <CheckCircle className="w-4 h-4" />{" "}
                          </button>{" "}
                          <button
                            onClick={() => updateStatus(doc.id, "REJECTED")}
                            className="p-2 text-destructive hover:bg-destructive/10 rounded-md"
                            title="Tolak"
                          >
                            {" "}
                            <XCircle className="w-4 h-4" />{" "}
                          </button>{" "}
                        </>
                      ) : (
                        <span
                          className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded ${doc.status === "APPROVED" ? "bg-emerald-100 text-emerald-700" : "bg-destructive/10 text-destructive"}`}
                        >
                          {" "}
                          {doc.status}{" "}
                        </span>
                      )}{" "}
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        download
                        className="p-2 text-muted-foreground hover:text-foreground"
                      >
                        {" "}
                        <Download className="w-4 h-4" />{" "}
                      </a>{" "}
                    </div>{" "}
                  </div>
                ))}{" "}
              </div>
            )}{" "}
          </CardContent>{" "}
        </Card>{" "}
      </div>{" "}
    </div>
  );
}
