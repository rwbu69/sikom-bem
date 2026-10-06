"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Megaphone, Plus, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
export default function PengumumanPage() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ title: "", content: "" });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const fetchAnnouncements = async () => {
    try {
      const res = await fetch("/api/announcements");
      const data = await res.json();
      setAnnouncements(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    }
  };
  useEffect(() => {
    fetchAnnouncements();
  }, []);
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setIsOpen(false);
        setFormData({ title: "", content: "" });
        fetchAnnouncements();
      } else {
        setError(data.message || "Gagal membuat pengumuman.");
      }
    } catch (error) {
      setError("Kesalahan jaringan.");
    }
  };
  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/announcements/${deleteId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        fetchAnnouncements();
      } else {
        alert(data.message || "Gagal menghapus pengumuman.");
      }
    } catch (err) {
      alert("Kesalahan jaringan.");
    } finally {
      setDeleteId(null);
    }
  };
  return (
    <div className="space-y-6">
      {" "}
      <div className="flex items-center justify-between">
        {" "}
        <div>
          {" "}
          <h1 className="text-2xl font-bold tracking-tight">Pengumuman</h1>{" "}
          <p className="text-muted-foreground">
            Kirim broadcast pengumuman ke seluruh anggota.
          </p>{" "}
        </div>{" "}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          {" "}
          <DialogTrigger render={<Button />}>
            {" "}
            <Plus className="mr-2 h-4 w-4" /> Buat Pengumuman{" "}
          </DialogTrigger>{" "}
          <DialogContent>
            {" "}
            <DialogHeader>
              {" "}
              <DialogTitle>Buat Pengumuman Baru</DialogTitle>{" "}
              <DialogDescription>
                {" "}
                Pengumuman ini akan tersimpan dalam sistem informasi.{" "}
              </DialogDescription>{" "}
            </DialogHeader>{" "}
            <form onSubmit={handleCreate} className="space-y-4 py-4">
              {" "}
              {error && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                  {" "}
                  {error}{" "}
                </div>
              )}{" "}
              <div className="space-y-2">
                {" "}
                <Label>Judul</Label>{" "}
                <Input
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />{" "}
              </div>{" "}
              <div className="space-y-2">
                {" "}
                <Label>Isi Pengumuman</Label>{" "}
                <textarea
                  className="flex min-h-[120px] w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-slate-950"
                  required
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                />{" "}
              </div>{" "}
              <Button type="submit" className="w-full">
                Broadcast Sekarang
              </Button>{" "}
            </form>{" "}
          </DialogContent>{" "}
        </Dialog>{" "}
      </div>{" "}
      <div className="grid gap-4 md:grid-cols-2">
        {" "}
        {announcements.length === 0 && (
          <p className="text-muted-foreground col-span-2">
            Belum ada pengumuman.
          </p>
        )}{" "}
        {announcements.map((ann) => (
          <Card key={ann.id}>
            {" "}
            <CardHeader className="relative">
              {" "}
              <div className="absolute top-4 right-4">
                {" "}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDeleteId(ann.id)}
                  className="h-7 w-7 text-destructive hover:bg-destructive/10"
                >
                  {" "}
                  <Trash2 size={14} />{" "}
                </Button>{" "}
              </div>{" "}
              <div className="flex items-center gap-2 mb-2 pr-8">
                {" "}
                <Megaphone className="h-4 w-4 text-primary" />{" "}
                <span className="text-xs text-muted-foreground">
                  {new Date(ann.createdAt).toLocaleDateString("id-ID")}
                </span>{" "}
              </div>{" "}
              <CardTitle className="text-lg pr-8">{ann.title}</CardTitle>{" "}
            </CardHeader>{" "}
            <CardContent>
              {" "}
              <p className="text-muted-foreground whitespace-pre-line text-sm">
                {ann.content}
              </p>{" "}
            </CardContent>{" "}
          </Card>
        ))}{" "}
      </div>{" "}
      <ConfirmDialog
        isOpen={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Hapus Pengumuman"
        description="Yakin ingin menghapus pengumuman ini secara permanen?"
        confirmText="Hapus"
        isDestructive={true}
        onConfirm={handleDelete}
      />{" "}
    </div>
  );
}
