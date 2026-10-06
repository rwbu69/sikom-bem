import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
export default function NotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-surface-muted text-foreground">
      {" "}
      <div className="flex flex-col items-center max-w-md text-center p-8 bg-card rounded-md border border-border">
        {" "}
        <div className="bg-destructive/10 p-4 rounded-full text-destructive mb-6">
          {" "}
          <AlertCircle size={48} />{" "}
        </div>{" "}
        <h1 className="text-4xl font-bold mb-2 text-foreground">404</h1>{" "}
        <h2 className="text-xl font-semibold mb-4">Halaman Tidak Ditemukan</h2>{" "}
        <p className="text-muted-foreground mb-8 text-sm">
          {" "}
          Maaf, halaman yang Anda cari mungkin telah dipindahkan atau tidak
          pernah ada dalam sistem.{" "}
        </p>{" "}
        <Link href="/">
          {" "}
          <Button className="w-full"> Kembali ke Beranda </Button>{" "}
        </Link>{" "}
      </div>{" "}
    </div>
  );
}
