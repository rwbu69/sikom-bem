"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Shield, AlertCircle, CheckCircle2 } from "lucide-react";
export default function UbahKeamananPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    if (password !== confirmPassword) {
      setError("Kata sandi baru dan konfirmasi tidak cocok.");
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError("Kata sandi minimal 6 karakter.");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword: password }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Kata sandi berhasil diubah! Mengarahkan...");
        setTimeout(() => {
          if (data.role === "ADMIN") {
            router.push("/admin");
          } else {
            router.push("/profil");
          }
        }, 1500);
      } else {
        setError(data.message || "Gagal mengubah kata sandi.");
      }
    } catch (err) {
      setError("Kesalahan koneksi ke server.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      {" "}
      <div className="bg-card border border-border p-8 rounded-md ">
        {" "}
        <div className="text-center mb-8 pb-6 border-b border-border/50">
          {" "}
          <h1 className="text-2xl font-heading font-semibold text-foreground tracking-tight mb-2">
            {" "}
            Keamanan Akun{" "}
          </h1>{" "}
          <p className="text-sm text-muted-foreground">
            {" "}
            Demi keamanan, Anda diwajibkan untuk mengubah kata sandi default
            Anda sebelum melanjutkan.{" "}
          </p>{" "}
        </div>{" "}
        <form onSubmit={handleSubmit} className="space-y-5">
          {" "}
          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md flex items-center gap-2">
              {" "}
              <AlertCircle className="w-4 h-4 flex-shrink-0" />{" "}
              <span>{error}</span>{" "}
            </div>
          )}{" "}
          {success && (
            <div className="p-3 text-sm text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-md flex items-center gap-2">
              {" "}
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />{" "}
              <span>{success}</span>{" "}
            </div>
          )}{" "}
          <div className="space-y-2">
            {" "}
            <Label htmlFor="password">Kata Sandi Baru</Label>{" "}
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
              className="h-11"
              required
            />{" "}
          </div>{" "}
          <div className="space-y-2">
            {" "}
            <Label htmlFor="confirmPassword">Konfirmasi Kata Sandi</Label>{" "}
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Ketik ulang kata sandi baru"
              className="h-11"
              required
            />{" "}
          </div>{" "}
          <Button type="submit" disabled={loading} className="w-full h-11">
            {" "}
            {loading ? "Menyimpan..." : "Simpan & Lanjutkan"}{" "}
          </Button>{" "}
        </form>{" "}
      </div>{" "}
    </div>
  );
}
