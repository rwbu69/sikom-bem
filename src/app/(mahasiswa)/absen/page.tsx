"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
function AbsenProcessor() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("Memproses data...");
  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Token QR tidak ditemukan.");
      return;
    }
    const verifyAttendance = async () => {
      try {
        const res = await fetch("/api/attendance/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        const data = await res.json();
        if (data.requireLogin) {
          router.push("/login?redirect=absen");
          return;
        }
        if (res.ok) {
          setStatus("success");
          setMessage(data.message);
        } else {
          setStatus("error");
          setMessage(data.message);
        }
      } catch (err) {
        setStatus("error");
        setMessage("Gangguan jaringan. Coba lagi.");
      }
    };
    verifyAttendance();
  }, [token, router]);
  return (
    <div className="w-full h-screen flex flex-col justify-between bg-background p-6 pt-12 pb-8 text-center max-w-sm mx-auto">
      {" "}
      <div className="flex-1 flex flex-col justify-center items-center">
        {" "}
        {status === "loading" && (
          <>
            {" "}
            <Loader2 className="w-10 h-12 text-muted-foreground animate-spin mb-4" />{" "}
            <h2 className="text-xl font-heading text-foreground mb-1">
              Merekam Kehadiran
            </h2>{" "}
            <p className="text-sm text-muted-foreground">
              Menghubungkan ke server...
            </p>{" "}
          </>
        )}{" "}
        {status === "success" && (
          <>
            {" "}
            <CheckCircle2 className="w-16 h-16 text-foreground mb-4" />{" "}
            <h1 className="text-3xl font-heading text-foreground mb-2">
              Tercatat.
            </h1>{" "}
            <p className="text-sm text-muted-foreground mb-8 px-4">
              {" "}
              Kehadiran Anda berhasil direkam dalam sistem.{" "}
            </p>{" "}
          </>
        )}{" "}
        {status === "error" && (
          <>
            {" "}
            <XCircle className="w-16 h-16 text-destructive mb-4" />{" "}
            <h1 className="text-3xl font-heading text-foreground mb-2">
              Gagal
            </h1>{" "}
            <p className="text-sm text-muted-foreground mb-8 px-4">
              {" "}
              {message}{" "}
            </p>{" "}
          </>
        )}{" "}
      </div>{" "}
      <div className="shrink-0 w-full">
        {" "}
        {status === "success" && (
          <Button
            onClick={() => router.push("/profil")}
            className="w-full h-12 bg-primary text-primary-foreground font-semibold rounded-md"
          >
            {" "}
            Kembali ke Profil{" "}
          </Button>
        )}{" "}
        {status === "error" && (
          <Button
            onClick={() => router.push("/login")}
            variant="outline"
            className="w-full h-12 font-semibold rounded-md border-border"
          >
            {" "}
            Login Ulang{" "}
          </Button>
        )}{" "}
      </div>{" "}
    </div>
  );
}
export default function AbsenPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full h-screen flex items-center justify-center">
          <Loader2 className="w-10 h-12 animate-spin text-muted-foreground" />
        </div>
      }
    >
      {" "}
      <AbsenProcessor />{" "}
    </Suspense>
  );
}
