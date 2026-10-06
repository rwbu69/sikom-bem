"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Calendar, Users, Edit, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
export default function KegiatanPage() {
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(
    null,
  ); /* Delete state */
  const [deleteId, setDeleteId] = useState<string | null>(
    null,
  ); /* Clash state */
  const [clashWarning, setClashWarning] = useState<string | null>(
    null,
  ); /* Form State */
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    location: "",
    posterUrl: "",
    startDate: "",
    endDate: "",
    capacity: "",
    visibility: "UMUM",
  });
  const [error, setError] = useState("");
  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/events");
      const data = await res.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchEvents();
  }, []);
  const handleCreate = async (e: React.FormEvent, force: boolean = false) => {
    if (e) e.preventDefault();
    setError("");
    if (!force) {
      /* Clash detection */
      const newStart = new Date(formData.startDate).getTime();
      const newEnd = new Date(formData.endDate).getTime();
      const overlap = events.find((ev) => {
        if (ev.id === editingId) return false;
        const evStart = new Date(ev.startDate).getTime();
        const evEnd = new Date(ev.endDate).getTime();
        return newStart < evEnd && newEnd > evStart;
      });
      if (overlap) {
        setClashWarning(
          `Jadwal bentrok dengan acara: ${overlap.name} (${new Date(overlap.startDate).toLocaleDateString("id-ID")}). Tetap simpan?`,
        );
        return;
      }
    }
    setClashWarning(null);
    try {
      const isEditing = !!editingId;
      const url = isEditing ? `/api/events/${editingId}` : "/api/events";
      const method = isEditing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setIsOpen(false);
        setEditingId(null);
        setFormData({
          code: "",
          name: "",
          description: "",
          location: "",
          posterUrl: "",
          startDate: "",
          endDate: "",
          capacity: "",
          visibility: "UMUM",
        });
        fetchEvents();
      } else {
        setError(
          data.message ||
            `Gagal ${isEditing ? "mengubah" : "membuat"} kegiatan.`,
        );
      }
    } catch (error) {
      setError("Kesalahan jaringan, tidak dapat menghubungi server.");
    }
  };
  const handleEdit = (event: any) => {
    setEditingId(event.id);
    setFormData({
      code: event.code,
      name: event.name,
      description: event.description || "",
      location: event.location || "",
      posterUrl: event.posterUrl || "",
      startDate: new Date(event.startDate).toISOString().slice(0, 16),
      endDate: new Date(event.endDate).toISOString().slice(0, 16),
      capacity: event.capacity ? event.capacity.toString() : "",
      visibility: event.visibility || "UMUM",
    });
    setIsOpen(true);
  };
  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/events/${deleteId}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        fetchEvents();
      } else {
        alert(data.message || "Gagal menghapus kegiatan.");
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
          <h1 className="text-2xl font-bold tracking-tight">
            Manajemen Kegiatan
          </h1>{" "}
          <p className="text-muted-foreground">
            Kelola semua program kerja dan acara BEM di sini.
          </p>{" "}
        </div>{" "}
        <Dialog
          open={isOpen}
          onOpenChange={(open) => {
            setIsOpen(open);
            if (!open) {
              setEditingId(null);
              setFormData({
                code: "",
                name: "",
                description: "",
                location: "",
                posterUrl: "",
                startDate: "",
                endDate: "",
                capacity: "",
                visibility: "UMUM",
              });
              setError("");
            }
          }}
        >
          {" "}
          <DialogTrigger render={<Button onClick={() => setIsOpen(true)} />}>
            {" "}
            <Plus className="mr-2 h-4 w-4" /> Buat Kegiatan Baru{" "}
          </DialogTrigger>{" "}
          <DialogContent className="sm:max-w-[500px]">
            {" "}
            <DialogHeader>
              {" "}
              <DialogTitle>
                {editingId ? "Ubah Kegiatan" : "Tambah Kegiatan"}
              </DialogTitle>{" "}
              <DialogDescription>
                {" "}
                {editingId
                  ? "Ubah detail program kerja atau acara ini."
                  : "Masukkan detail program kerja atau acara baru. Klik simpan setelah selesai."}{" "}
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
              <div className="grid grid-cols-2 gap-4">
                {" "}
                <div className="space-y-2">
                  {" "}
                  <Label>Kode Kegiatan (Unik)</Label>{" "}
                  <Input
                    placeholder="Misal: LDK-2026"
                    required
                    value={formData.code}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, code: e.target.value })
                    }
                  />{" "}
                </div>{" "}
                <div className="space-y-2">
                  {" "}
                  <Label>Nama Kegiatan</Label>{" "}
                  <Input
                    placeholder="Latihan Dasar..."
                    required
                    value={formData.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />{" "}
                </div>{" "}
              </div>{" "}
              <div className="space-y-2">
                {" "}
                <Label>Deskripsi Singkat</Label>{" "}
                <Input
                  placeholder="Penjelasan acara..."
                  value={formData.description}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />{" "}
              </div>{" "}
              <div className="grid grid-cols-2 gap-4">
                {" "}
                <div className="space-y-2">
                  {" "}
                  <Label>Lokasi (Opsional)</Label>{" "}
                  <Input
                    placeholder="Gedung Serbaguna..."
                    value={formData.location}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                  />{" "}
                </div>{" "}
                <div className="space-y-2">
                  {" "}
                  <Label>URL Poster (Opsional)</Label>{" "}
                  <Input
                    placeholder="https://..."
                    value={formData.posterUrl}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, posterUrl: e.target.value })
                    }
                  />{" "}
                </div>{" "}
              </div>{" "}
              <div className="grid grid-cols-2 gap-4">
                {" "}
                <div className="space-y-2">
                  {" "}
                  <Label>Waktu Mulai</Label>{" "}
                  <Input
                    type="datetime-local"
                    required
                    value={formData.startDate}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                  />{" "}
                </div>{" "}
                <div className="space-y-2">
                  {" "}
                  <Label>Waktu Selesai</Label>{" "}
                  <Input
                    type="datetime-local"
                    required
                    value={formData.endDate}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                  />{" "}
                </div>{" "}
              </div>{" "}
              <div className="grid grid-cols-2 gap-4">
                {" "}
                <div className="space-y-2">
                  {" "}
                  <Label>Kuota Peserta (Opsional)</Label>{" "}
                  <Input
                    type="number"
                    placeholder="Kosongkan jika tak terbatas"
                    value={formData.capacity}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, capacity: e.target.value })
                    }
                  />{" "}
                </div>{" "}
                <div className="space-y-2">
                  {" "}
                  <Label>Visibilitas</Label>{" "}
                  <select
                    value={formData.visibility}
                    onChange={(e) =>
                      setFormData({ ...formData, visibility: e.target.value })
                    }
                    className="flex h-9 w-full items-center justify-between rounded-md border border-border bg-card px-3 py-2 text-sm ring-offset-white placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {" "}
                    <option value="UMUM">Umum (Semua Orang)</option>{" "}
                    <option value="INTERNAL">Internal (BEM Saja)</option>{" "}
                  </select>{" "}
                </div>{" "}
              </div>{" "}
              <Button type="submit" className="w-full">
                Simpan Kegiatan
              </Button>{" "}
            </form>{" "}
          </DialogContent>{" "}
        </Dialog>{" "}
      </div>{" "}
      <div className="flex items-center gap-2 mb-4">
        {" "}
        <div className="relative flex-1 max-w-sm">
          {" "}
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />{" "}
          <Input
            type="search"
            placeholder="Cari kegiatan..."
            className="pl-9 bg-card"
          />{" "}
        </div>{" "}
      </div>{" "}
      {loading ? (
        <div className="text-center py-10 text-muted-foreground">
          Memuat data...
        </div>
      ) : events.length === 0 ? (
        <Card className="bg-surface-muted border-dashed border-2">
          {" "}
          <CardContent className="flex flex-col items-center justify-center h-48 text-center text-muted-foreground">
            {" "}
            <Calendar className="h-10 w-10 mb-4 text-muted-foreground" />{" "}
            <p className="font-medium text-foreground">Belum ada kegiatan</p>{" "}
            <p className="text-sm">
              Silakan buat kegiatan pertama Anda menggunakan tombol di atas.
            </p>{" "}
          </CardContent>{" "}
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {" "}
          {events.map((event) => (
            <Card
              key={event.id}
              className="overflow-hidden group hover: transition-shadow flex flex-col h-full"
            >
              {" "}
              <CardHeader className="pb-3 pt-5">
                {" "}
                <div className="flex justify-between items-start">
                  {" "}
                  <div className="flex gap-2 flex-wrap">
                    {" "}
                    <div className="text-[10px] font-bold text-muted-foreground bg-secondary px-2 py-1 rounded-md mb-2 inline-block uppercase tracking-wider">
                      {" "}
                      {event.code}{" "}
                    </div>{" "}
                    {event.status === "OPEN" && (
                      <div className="text-[10px] font-bold text-emerald-700 bg-emerald-100 border border-emerald-200 px-2 py-1 rounded-md mb-2 inline-block uppercase tracking-wider">
                        {" "}
                        Pendaftaran Buka{" "}
                      </div>
                    )}{" "}
                    {event.status === "CLOSED" && (
                      <div className="text-[10px] font-bold text-amber-700 bg-amber-100 border border-amber-200 px-2 py-1 rounded-md mb-2 inline-block uppercase tracking-wider">
                        {" "}
                        Pendaftaran Tutup{" "}
                      </div>
                    )}{" "}
                    {event.status === "DRAFT" && (
                      <div className="text-[10px] font-bold text-muted-foreground bg-secondary border border-border px-2 py-1 rounded-md mb-2 inline-block uppercase tracking-wider">
                        {" "}
                        Draft{" "}
                      </div>
                    )}{" "}
                    {event.status === "COMPLETED" && (
                      <div className="text-[10px] font-bold text-indigo-700 bg-indigo-100 border border-indigo-200 px-2 py-1 rounded-md mb-2 inline-block uppercase tracking-wider">
                        {" "}
                        Selesai{" "}
                      </div>
                    )}{" "}
                    {event.visibility === "INTERNAL" && (
                      <div className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-1 rounded-md mb-2 inline-block uppercase tracking-wider">
                        {" "}
                        INTERNAL{" "}
                      </div>
                    )}{" "}
                  </div>{" "}
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    {" "}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(event)}
                      className="h-7 w-7 text-muted-foreground hover:bg-blue-50"
                    >
                      <Edit size={14} />
                    </Button>{" "}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteId(event.id)}
                      className="h-7 w-7 text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 size={14} />
                    </Button>{" "}
                  </div>{" "}
                </div>{" "}
                <CardTitle className="text-lg leading-tight">
                  {event.name}
                </CardTitle>{" "}
                <CardDescription className="line-clamp-2 mt-1">
                  {event.description || "Tidak ada deskripsi"}
                </CardDescription>{" "}
              </CardHeader>{" "}
              <CardContent className="flex flex-col flex-grow">
                {" "}
                <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                  {" "}
                  <div className="flex items-center gap-2">
                    {" "}
                    <Calendar className="h-4 w-4 text-muted-foreground" />{" "}
                    <span>
                      {new Date(event.startDate).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>{" "}
                  </div>{" "}
                  <div className="flex items-center gap-2">
                    {" "}
                    <Users className="h-4 w-4 text-muted-foreground" />{" "}
                    <span>
                      {" "}
                      {event._count.registrations} Pendaftar{" "}
                      {event.capacity ? ` / ${event.capacity}` : ""}{" "}
                    </span>{" "}
                  </div>{" "}
                </div>{" "}
                <div className="flex gap-2 mt-auto pt-4 border-t border-border">
                  {" "}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs border-border hover:bg-indigo-50"
                    onClick={() =>
                      router.push(`/admin/kegiatan/${event.id}/kepanitiaan`)
                    }
                  >
                    {" "}
                    <Users size={14} className="mr-1.5" /> Panitia{" "}
                  </Button>{" "}
                </div>{" "}
              </CardContent>{" "}
            </Card>
          ))}{" "}
        </div>
      )}{" "}
      <ConfirmDialog
        isOpen={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Hapus Kegiatan"
        description="Apakah Anda yakin ingin menghapus kegiatan ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Hapus"
        isDestructive={true}
        onConfirm={handleDelete}
      />{" "}
      <ConfirmDialog
        isOpen={!!clashWarning}
        onOpenChange={(open) => !open && setClashWarning(null)}
        title="Peringatan Bentrok Jadwal"
        description={clashWarning || ""}
        confirmText="Tetap Simpan"
        isDestructive={false}
        onConfirm={() => handleCreate(null as unknown as React.FormEvent, true)}
      />{" "}
    </div>
  );
}
