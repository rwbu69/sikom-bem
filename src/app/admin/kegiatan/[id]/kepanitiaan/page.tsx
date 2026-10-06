"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Plus, Trash2, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
export default function DetailKepanitiaanPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;
  const [event, setEvent] = useState<any>(null);
  const [divisions, setDivisions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true); /* Form State */
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    quota: "",
    customQuestion1: "",
    customQuestion2: "",
  });
  const [error, setError] = useState("");
  const fetchData = async () => {
    setLoading(true);
    try {
      const [resEvent, resDiv] = await Promise.all([
        fetch(`/api/events`) /* Find event manually */,
        fetch(`/api/committee/divisions?eventId=${eventId}`),
      ]);
      const dataEvents = await resEvent.json();
      const currentEvent = dataEvents.find((e: any) => e.id === eventId);
      if (currentEvent) setEvent(currentEvent);
      if (resDiv.ok) {
        setDivisions(await resDiv.json());
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
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/committee/divisions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, eventId }),
      });
      const data = await res.json();
      if (res.ok) {
        setIsOpen(false);
        setFormData({
          name: "",
          quota: "",
          customQuestion1: "",
          customQuestion2: "",
        });
        fetchData();
      } else {
        setError(data.message || "Gagal membuat divisi.");
      }
    } catch (err) {
      setError("Kesalahan jaringan.");
    }
  };
  const handleDelete = async (id: string) => {
    if (!confirm("Hapus divisi ini?")) return;
    try {
      const res = await fetch(`/api/committee/divisions/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        fetchData();
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Kesalahan jaringan.");
    }
  };
  if (loading)
    return (
      <div className="p-8 text-center text-muted-foreground">Memuat...</div>
    );
  if (!event)
    return (
      <div className="p-8 text-center text-muted-foreground">
        Kegiatan tidak ditemukan.
      </div>
    );
  return (
    <div className="space-y-6">
      {" "}
      <div className="flex items-center gap-4 border-b border-border pb-4">
        {" "}
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.push("/admin/kegiatan")}
          className="h-8 w-8 hover:bg-secondary"
        >
          {" "}
          <ArrowLeft size={16} />{" "}
        </Button>{" "}
        <div>
          {" "}
          <h1 className="text-2xl font-bold text-foreground">
            Kepanitiaan: {event.name}
          </h1>{" "}
          <p className="text-sm text-muted-foreground">
            Kelola divisi dan lihat pelamar untuk kegiatan ini.
          </p>{" "}
        </div>{" "}
      </div>{" "}
      <div className="flex justify-between items-center">
        {" "}
        <h2 className="text-lg font-bold text-foreground">
          Divisi Panitia
        </h2>{" "}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          {" "}
          <DialogTrigger render={<Button className="gap-2" />}>
            {" "}
            <Plus size={16} /> Tambah Divisi{" "}
          </DialogTrigger>{" "}
          <DialogContent className="sm:max-w-[425px]">
            {" "}
            <DialogHeader>
              {" "}
              <DialogTitle>Tambah Divisi Baru</DialogTitle>{" "}
            </DialogHeader>{" "}
            <form onSubmit={handleCreate} className="space-y-4 pt-4">
              {" "}
              {error && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                  {error}
                </div>
              )}{" "}
              <div className="space-y-2">
                {" "}
                <Label>Nama Divisi</Label>{" "}
                <Input
                  required
                  placeholder="Misal: Acara, Humas, dsb."
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />{" "}
              </div>{" "}
              <div className="space-y-2">
                {" "}
                <Label>Kuota (Opsional)</Label>{" "}
                <Input
                  type="number"
                  placeholder="Berapa orang yang dibutuhkan?"
                  value={formData.quota}
                  onChange={(e) =>
                    setFormData({ ...formData, quota: e.target.value })
                  }
                />{" "}
              </div>{" "}
              <div className="space-y-2">
                {" "}
                <Label>Pertanyaan Tambahan 1 (Opsional)</Label>{" "}
                <Input
                  placeholder="Misal: Punya kamera jenis apa?"
                  value={formData.customQuestion1}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      customQuestion1: e.target.value,
                    })
                  }
                />{" "}
              </div>{" "}
              <div className="space-y-2">
                {" "}
                <Label>Pertanyaan Tambahan 2 (Opsional)</Label>{" "}
                <Input
                  placeholder="Misal: Bisa edit video pakai apa?"
                  value={formData.customQuestion2}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      customQuestion2: e.target.value,
                    })
                  }
                />{" "}
              </div>{" "}
              <Button type="submit" className="w-full">
                Simpan Divisi
              </Button>{" "}
            </form>{" "}
          </DialogContent>{" "}
        </Dialog>{" "}
      </div>{" "}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {" "}
        {divisions.length === 0 ? (
          <div className="col-span-full p-8 text-center bg-surface-muted rounded-md border border-dashed border-border">
            {" "}
            <p className="text-muted-foreground text-sm">
              Belum ada divisi yang dibuat. Tambahkan divisi agar mahasiswa bisa
              mulai mendaftar.
            </p>{" "}
          </div>
        ) : (
          divisions.map((div) => (
            <Card key={div.id}>
              {" "}
              <CardHeader className="pb-3 flex flex-row items-start justify-between space-y-0">
                {" "}
                <div>
                  {" "}
                  <CardTitle className="text-lg">{div.name}</CardTitle>{" "}
                  <CardDescription className="flex items-center gap-1 mt-1">
                    {" "}
                    <Users size={14} /> Kuota: {div.quota || "Tanpa batas"}{" "}
                  </CardDescription>{" "}
                </div>{" "}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(div.id)}
                  className="text-destructive h-8 w-8 hover:bg-destructive/10"
                >
                  {" "}
                  <Trash2 size={16} />{" "}
                </Button>{" "}
              </CardHeader>{" "}
              {(div.customQuestion1 || div.customQuestion2) && (
                <CardContent className="pt-0 text-xs text-muted-foreground border-t border-border mt-2 p-4 pb-2">
                  {" "}
                  <p className="font-semibold mb-1 text-foreground">
                    Pertanyaan Khusus:
                  </p>{" "}
                  <ul className="list-disc pl-4 space-y-1">
                    {" "}
                    {div.customQuestion1 && <li>{div.customQuestion1}</li>}{" "}
                    {div.customQuestion2 && <li>{div.customQuestion2}</li>}{" "}
                  </ul>{" "}
                </CardContent>
              )}{" "}
            </Card>
          ))
        )}{" "}
      </div>{" "}
      <div className="mt-12">
        {" "}
        <div className="flex justify-between items-center mb-4">
          {" "}
          <h2 className="text-lg font-bold text-foreground">
            Daftar Pelamar
          </h2>{" "}
          <Button
            variant="outline"
            onClick={() =>
              router.push(`/admin/kegiatan/${eventId}/kepanitiaan/pelamar`)
            }
            className="hover:bg-indigo-50 border-border"
          >
            {" "}
            Buka Dasbor Seleksi &rarr;{" "}
          </Button>{" "}
        </div>{" "}
        <Card className="p-8 text-center text-muted-foreground bg-surface-muted border-dashed">
          {" "}
          <p className="mb-4 text-sm">
            Untuk mengelola, menyortir, dan menerima pelamar, silakan buka
            Dasbor Seleksi.
          </p>{" "}
        </Card>{" "}
      </div>{" "}
    </div>
  );
}
