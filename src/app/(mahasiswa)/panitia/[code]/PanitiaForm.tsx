"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
export default function PanitiaForm({
  eventId,
  divisions,
  savedWhatsapp,
}: {
  eventId: string;
  divisions: any[];
  savedWhatsapp: string;
}) {
  const [division1, setDivision1] = useState("");
  const [division2, setDivision2] = useState("");
  const [reason, setReason] = useState("");
  const [experience, setExperience] = useState("");
  const [whatsapp, setWhatsapp] = useState(savedWhatsapp);
  const [commitment, setCommitment] = useState(false);
  const [customAns1, setCustomAns1] = useState("");
  const [customAns2, setCustomAns2] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");
  const selectedDiv1 = divisions.find((d) => d.id === division1);
  const selectedDiv2 = divisions.find((d) => d.id === division2);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commitment) {
      setStatus("error");
      setMessage("Kamu harus menyetujui komitmen kehadiran.");
      return;
    }
    if (!division1) {
      setStatus("error");
      setMessage("Pilihan divisi 1 wajib diisi.");
      return;
    }
    if (division1 === division2) {
      setStatus("error");
      setMessage("Pilihan divisi 1 dan 2 tidak boleh sama.");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/committee/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
          division1Id: division1,
          division2Id: division2 || null,
          reason,
          experience: [
            experience,
            selectedDiv1?.customQuestion1
              ? `Q: ${selectedDiv1.customQuestion1} A: ${customAns1}`
              : "",
            selectedDiv1?.customQuestion2
              ? `Q: ${selectedDiv1.customQuestion2} A: ${customAns2}`
              : "",
          ]
            .filter(Boolean)
            .join("\n\n"),
          whatsapp,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
        setMessage(data.message || "Gagal mendaftar");
      }
    } catch (error) {
      setStatus("error");
      setMessage("Terjadi kesalahan jaringan.");
    }
  };
  if (status === "success") {
    return (
      <div className="py-6 flex flex-col items-center text-center">
        {" "}
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
          {" "}
          <CheckCircle2 className="w-8 h-8 text-green-600" />{" "}
        </div>{" "}
        <h3 className="text-2xl font-bold text-foreground mb-3">
          Aplikasi Berhasil Dikirim!
        </h3>{" "}
        <p className="text-muted-foreground mb-8 max-w-sm">
          {" "}
          Terima kasih sudah melamar menjadi panitia. Pantau terus status
          seleksimu di halaman Profil.{" "}
        </p>{" "}
        <Link
          href="/profil"
          className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 transition text-white font-semibold rounded-md w-full sm:w-auto"
        >
          {" "}
          Cek Profil{" "}
        </Link>{" "}
      </div>
    );
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {" "}
      <div className="grid sm:grid-cols-2 gap-4">
        {" "}
        <div className="space-y-2">
          {" "}
          <Label className="font-semibold">Pilihan Divisi 1 (Wajib)</Label>{" "}
          <select
            required
            value={division1}
            onChange={(e) => setDivision1(e.target.value)}
            className="w-full h-12 border rounded-md px-3 bg-card text-sm"
          >
            {" "}
            <option value="" disabled>
              -- Pilih Divisi --
            </option>{" "}
            {divisions.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}{" "}
          </select>{" "}
        </div>{" "}
        <div className="space-y-2">
          {" "}
          <Label className="font-semibold">
            Pilihan Divisi 2 (Opsional)
          </Label>{" "}
          <select
            value={division2}
            onChange={(e) => setDivision2(e.target.value)}
            className="w-full h-12 border rounded-md px-3 bg-card text-sm"
          >
            {" "}
            <option value="">-- Kosongkan jika tidak ada --</option>{" "}
            {divisions.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}{" "}
          </select>{" "}
        </div>{" "}
      </div>{" "}
      <div className="space-y-2">
        {" "}
        <Label className="font-semibold">Alasan Singkat Bergabung</Label>{" "}
        <Textarea
          required
          maxLength={300}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Kenapa tertarik di divisi ini? (Maksimal 300 karakter)"
          className="resize-none h-24"
        />{" "}
        <div className="text-xs text-right text-muted-foreground">
          {reason.length}/300
        </div>{" "}
      </div>{" "}
      <div className="space-y-2">
        {" "}
        <Label className="font-semibold">
          Pengalaman Relevan (Opsional)
        </Label>{" "}
        <Input
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          placeholder="Pernah panitia apa, atau skill apa yang cocok (desain, videografi, dsb)"
        />{" "}
      </div>{" "}
      <div className="space-y-2">
        {" "}
        <Label className="font-semibold">Nomor WhatsApp Aktif</Label>{" "}
        <Input
          required
          type="tel"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          placeholder="081234567890"
        />{" "}
        <p className="text-xs text-muted-foreground">
          Akan disimpan di profil agar otomatis terisi di pendaftaran
          berikutnya.
        </p>{" "}
      </div>{" "}
      {/* Tampilkan Custom Questions dari Divisi 1 jika ada, (ini fitur fleksibilitas) */}{" "}
      {selectedDiv1 &&
        (selectedDiv1.customQuestion1 || selectedDiv1.customQuestion2) && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-md space-y-4">
            {" "}
            <p className="text-xs font-bold text-amber-800 uppercase">
              Pertanyaan Khusus Divisi 1
            </p>{" "}
            {selectedDiv1.customQuestion1 && (
              <div className="space-y-1">
                {" "}
                <Label className="text-sm">
                  {selectedDiv1.customQuestion1}
                </Label>{" "}
                <Input
                  required
                  value={customAns1}
                  onChange={(e) => setCustomAns1(e.target.value)}
                  placeholder="Jawaban singkatmu..."
                />{" "}
              </div>
            )}{" "}
            {selectedDiv1.customQuestion2 && (
              <div className="space-y-1">
                {" "}
                <Label className="text-sm">
                  {selectedDiv1.customQuestion2}
                </Label>{" "}
                <Input
                  required
                  value={customAns2}
                  onChange={(e) => setCustomAns2(e.target.value)}
                  placeholder="Jawaban singkatmu..."
                />{" "}
              </div>
            )}{" "}
          </div>
        )}{" "}
      <div className="flex items-start gap-3 p-4 bg-surface-muted rounded-md border border-border">
        {" "}
        <Checkbox
          id="commitment"
          checked={commitment}
          onCheckedChange={(checked) => setCommitment(checked as boolean)}
          className="mt-1"
        />{" "}
        <div className="grid gap-1.5 leading-none">
          {" "}
          <label
            htmlFor="commitment"
            className="text-sm font-bold text-foreground cursor-pointer"
          >
            {" "}
            Persetujuan Komitmen{" "}
          </label>{" "}
          <p className="text-sm text-muted-foreground">
            {" "}
            Aku siap hadir dan berkontribusi aktif di seluruh rapat dan pada
            hari H pelaksanaan kegiatan.{" "}
          </p>{" "}
        </div>{" "}
      </div>{" "}
      {status === "error" && (
        <div className="p-4 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20 flex items-center gap-3">
          {" "}
          <AlertCircle className="w-5 h-5 flex-shrink-0" />{" "}
          <span className="font-medium">{message}</span>{" "}
        </div>
      )}{" "}
      <Button
        type="submit"
        disabled={status === "loading"}
        className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
      >
        {" "}
        {status === "loading" ? "Memproses..." : "Kirim Lamaran Panitia"}{" "}
      </Button>{" "}
    </form>
  );
}
