"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AlertCircle, GraduationCap, ArrowRight } from "lucide-react";
export default function LoginPage() {
  const router = useRouter();
  const [nim, setNim] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nim, password }),
      });
      const data = await res.json();
      if (res.ok) {
        if (data.attendanceMsg) {
          alert(data.attendanceMsg);
        }
        if (data.isDefaultPassword) {
          router.push("/profil/keamanan");
        } else if (data.role === "ADMIN") {
          router.push("/admin");
        } else {
          router.push("/profil");
        }
      } else {
        setError(data.message || "Gagal masuk.");
      }
    } catch (err) {
      setError("Kesalahan koneksi ke server.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen w-full flex bg-surface-muted">
      {" "}
      {/* Kiri: Area Branding (Hanya muncul di Desktop) */}{" "}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-12 relative overflow-hidden bg-slate-950">
        {" "}
        {/* Latar Belakang Gambar & Overlay Modern */}{" "}
        <img
          src="/left-image.png"
          alt="Login Background"
          className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-luminosity"
        />{" "}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>{" "}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 to-transparent"></div>{" "}
        <div className="relative z-10 flex items-center gap-3">
          {" "}
          {/* Tempat Logo BEM (Ganti file /public/logo.png nantinya) */}{" "}
          <div className="w-12 h-12 bg-card flex items-center justify-center rounded-md p-1.5 ">
            {" "}
            <img
              src="/logo.png"
              alt="BEM Logo"
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://ui-avatars.com/api/?name=BEM&background=0f3460&color=fff&rounded=true&bold=true";
              }}
            />{" "}
          </div>{" "}
          <span className="font-heading font-bold text-xl tracking-tight text-white">
            SIKOM BEM
          </span>{" "}
        </div>{" "}
        <div className="relative z-10 space-y-2">
          {" "}
          <h1 className="text-5xl font-heading leading-tight font-bold text-white drop-">
            {" "}
            Sistem Informasi <br />
            Kegiatan Mahasiswa{" "}
          </h1>{" "}
        </div>{" "}
        <div className="relative z-10 text-white/60 text-sm font-medium">
          {" "}
          © {new Date().getFullYear()} BEM UKRIM. All rights reserved.{" "}
        </div>{" "}
      </div>{" "}
      {/* Kanan: Area Form Login (Penuh di HP, Separuh di Desktop) */}{" "}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-4 sm:p-12 relative overflow-hidden">
        {" "}
        {/* Dekorasi Background Mobile dengan Gambar */}{" "}
        <div className="absolute top-0 left-0 right-0 h-[35vh] lg:hidden z-0 bg-foreground">
          {" "}
          <img
            src="/left-image.png"
            alt="Campus Mobile Background"
            className="w-full h-full object-cover opacity-50 mix-blend-overlay"
          />{" "}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-black/10 to-black/40"></div>{" "}
        </div>{" "}
        <div className="w-full max-w-md space-y-8 bg-card lg:bg-transparent p-8 lg:p-0 rounded-md lg:rounded-none shadow-slate-200/50 lg:shadow-none border border-border lg:border-transparent relative z-10 mt-[15vh] lg:mt-0">
          {" "}
          {/* Header Form */}{" "}
          <div className="text-center lg:text-left">
            {" "}
            <div className="lg:hidden mx-auto flex items-center justify-center w-16 h-16 bg-card rounded-md border border-border p-2 mb-6">
              {" "}
              <img
                src="/logo.png"
                alt="BEM Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://ui-avatars.com/api/?name=BEM&background=0f3460&color=fff&rounded=true&bold=true";
                }}
              />{" "}
            </div>{" "}
            <h2 className="text-3xl font-heading font-bold text-foreground mb-2">
              Selamat Datang
            </h2>{" "}
            <p className="text-muted-foreground text-sm font-medium">
              {" "}
              Silakan masuk ke akun Anda untuk melanjutkan.{" "}
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
            <div className="space-y-2 text-left">
              {" "}
              <Label htmlFor="nim" className="text-foreground font-semibold">
                Nomor Induk Mahasiswa
              </Label>{" "}
              <Input
                id="nim"
                value={nim}
                onChange={(e) => setNim(e.target.value)}
                placeholder="Misal: 12345678"
                className="h-12 bg-background font-mono px-4"
                required
              />{" "}
            </div>{" "}
            <div className="space-y-2 text-left">
              {" "}
              <Label
                htmlFor="password"
                className="text-foreground font-semibold"
              >
                Kata Sandi
              </Label>{" "}
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ketik sandi Anda"
                className="h-12 bg-background px-4"
                required
              />{" "}
            </div>{" "}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-primary text-primary-foreground font-semibold mt-4 text-base flex items-center justify-center gap-2"
            >
              {" "}
              {loading ? (
                "Memverifikasi..."
              ) : (
                <>
                  Masuk <ArrowRight className="w-4 h-4" />
                </>
              )}{" "}
            </Button>{" "}
          </form>{" "}
          <div className="text-center">
            {" "}
            <p className="text-xs text-muted-foreground">
              {" "}
              Lupa kata sandi? Silakan hubungi admin atau panitia kegiatan.{" "}
            </p>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
