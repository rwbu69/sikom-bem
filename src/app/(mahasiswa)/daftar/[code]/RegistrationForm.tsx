"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
export default function RegistrationForm({ eventId }: { eventId: string }) {
  const [nim, setNim] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/public/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, nim, name, password }),
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
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-6">
          {" "}
          <CheckCircle2 className="w-8 h-8 text-muted-foreground" />{" "}
        </div>{" "}
        <h3 className="text-2xl font-bold font-heading text-foreground mb-3">
          Pendaftaran Berhasil
        </h3>{" "}
        <p className="text-muted-foreground mb-8 max-w-sm">
          {" "}
          Tiket QR dan riwayat absensimu bisa kamu cek kapan saja lewat profil
          mahasiswa.{" "}
        </p>{" "}
        <Link
          href="/login"
          className="px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-md w-full sm:w-auto"
        >
          {" "}
          Lanjut ke Login{" "}
        </Link>{" "}
      </div>
    );
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {" "}
      <div className="space-y-2">
        {" "}
        <Label className="font-semibold text-foreground">
          Nomor Induk Mahasiswa (NIM)
        </Label>{" "}
        <Input
          required
          value={nim}
          onChange={(e) => setNim(e.target.value)}
          placeholder="Misal: 123456789"
          className="h-12 bg-background border-border text-foreground px-4 font-mono"
        />{" "}
      </div>{" "}
      <div className="space-y-2">
        {" "}
        <Label className="font-semibold text-foreground">
          Nama Lengkap
        </Label>{" "}
        <Input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Misal: Budi Santoso"
          className="h-12 bg-background border-border text-foreground px-4"
        />{" "}
      </div>{" "}
      <div className="space-y-2">
        {" "}
        <Label className="font-semibold text-foreground">
          Kata Sandi (Buat Password)
        </Label>{" "}
        <Input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Gunakan sandi yang mudah diingat"
          className="h-12 bg-background border-border text-foreground px-4"
        />{" "}
      </div>{" "}
      {status === "error" && (
        <div className="p-4 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20 flex items-start gap-3">
          {" "}
          <AlertCircle className="w-5 h-5 flex-shrink-0" />{" "}
          <span className="font-medium">{message}</span>{" "}
        </div>
      )}{" "}
      <Button
        type="submit"
        disabled={status === "loading"}
        className="w-full h-12 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
      >
        {" "}
        {status === "loading" ? "Memproses..." : "Daftar Kegiatan"}{" "}
      </Button>{" "}
    </form>
  );
}
