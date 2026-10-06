"use client";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Shield,
  KeyRound,
  Upload,
  Users,
  AlertCircle,
  CheckCircle2,
  UserPlus,
  X,
} from "lucide-react";
import * as XLSX from "xlsx";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { toast } from "sonner";
export default function PenggunaDashboard() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [importStatus, setImportStatus] = useState<{
    success?: string;
    error?: string;
    failedRows?: any[];
  }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newNim, setNewNim] = useState("");
  const [newName, setNewName] = useState("");
  const [confirmRoleConfig, setConfirmRoleConfig] = useState<{
    id: string;
    role: string;
  } | null>(null);
  const [confirmResetConfig, setConfirmResetConfig] = useState<{
    id: string;
    nim: string;
  } | null>(null);
  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);
  const handleToggleRole = async (
    id: string,
    currentRole: string,
    isSuperAdmin: boolean,
  ) => {
    if (isSuperAdmin) {
      toast.error("Tidak dapat mengubah role Super Admin.");
      return;
    }
    setConfirmRoleConfig({
      id,
      role: currentRole === "ADMIN" ? "MAHASISWA" : "ADMIN",
    });
  };
  const executeToggleRole = async () => {
    if (!confirmRoleConfig) return;
    try {
      const res = await fetch(`/api/admin/users/${confirmRoleConfig.id}/role`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: confirmRoleConfig.role }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Hak akses berhasil diubah");
        fetchUsers();
      } else toast.error(data.message || "Gagal mengubah hak akses");
    } catch (err) {
      toast.error("Kesalahan jaringan");
    } finally {
      setConfirmRoleConfig(null);
    }
  };
  const handleResetPassword = (id: string, nim: string) => {
    setConfirmResetConfig({ id, nim });
  };
  const executeResetPassword = async () => {
    if (!confirmResetConfig) return;
    try {
      const res = await fetch(
        `/api/admin/users/${confirmResetConfig.id}/reset`,
        { method: "PUT" },
      );
      const data = await res.json();
      if (res.ok) {
        toast.success("Sandi berhasil direset.");
        fetchUsers();
      } else {
        toast.error(data.message || "Gagal mereset sandi");
      }
    } catch (err) {
      toast.error("Kesalahan jaringan");
    } finally {
      setConfirmResetConfig(null);
    }
  };
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNim || !newName) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nim: newNim, name: newName }),
      });
      const data = await res.json();
      if (res.ok) {
        setNewNim("");
        setNewName("");
        setShowAddForm(false);
        toast.success("Pengguna berhasil ditambahkan");
        fetchUsers();
      } else {
        toast.error(data.message || "Gagal menambahkan");
      }
    } catch (err) {
      toast.error("Kesalahan jaringan");
    } finally {
      setLoading(false);
    }
  };
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setImportStatus({});
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        const res = await fetch("/api/admin/users/import", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data }),
        });
        const result = await res.json();
        if (res.ok) {
          setImportStatus({
            success: result.message,
            failedRows: result.failedRows,
          });
          fetchUsers();
        } else {
          setImportStatus({ error: result.message || "Gagal import" });
        }
      } catch (err) {
        setImportStatus({
          error: "Kesalahan membaca file Excel. Pastikan format benar.",
        });
      } finally {
        setLoading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };
    reader.readAsBinaryString(file);
  };
  return (
    <div className="space-y-6">
      {" "}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between border-b border-border pb-4">
        {" "}
        <div>
          {" "}
          <h1 className="text-2xl font-heading text-foreground mb-1">
            Manajemen Pengguna
          </h1>{" "}
          <p className="text-sm text-muted-foreground">
            Kelola admin, mahasiswa, dan impor data massal.
          </p>{" "}
        </div>{" "}
        <div className="flex gap-2 w-full sm:w-auto">
          {" "}
          <input
            type="file"
            accept=".xlsx, .xls"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileUpload}
          />{" "}
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            variant="outline"
            className="gap-2 flex-1 sm:flex-none bg-card border-border"
          >
            {" "}
            <Upload size={16} />{" "}
            {loading ? "Memproses..." : "Import Excel"}{" "}
          </Button>{" "}
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            variant="default"
            className="gap-2 flex-1 sm:flex-none"
          >
            {" "}
            {showAddForm ? <X size={16} /> : <UserPlus size={16} />}{" "}
            {showAddForm ? "Batal" : "Tambah Mahasiswa"}{" "}
          </Button>{" "}
        </div>{" "}
      </div>{" "}
      {importStatus.success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-md">
          {" "}
          <p className="text-emerald-700 font-medium flex items-center gap-2">
            {" "}
            <CheckCircle2 className="w-5 h-5" /> {importStatus.success}{" "}
          </p>{" "}
          {importStatus.failedRows && importStatus.failedRows.length > 0 && (
            <div className="mt-2 text-sm text-emerald-800">
              {" "}
              <p className="font-semibold mb-1">
                Sebagian baris gagal diproses:
              </p>{" "}
              <ul className="list-disc pl-5 max-h-32 overflow-y-auto">
                {" "}
                {importStatus.failedRows.map((f, i) => (
                  <li key={i}>
                    Baris {f.row}: {f.reason}
                  </li>
                ))}{" "}
              </ul>{" "}
            </div>
          )}{" "}
        </div>
      )}{" "}
      {importStatus.error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md text-destructive flex items-center gap-2">
          {" "}
          <AlertCircle className="w-5 h-5" /> {importStatus.error}{" "}
        </div>
      )}{" "}
      {showAddForm && (
        <form
          onSubmit={handleAddUser}
          className="bg-card border border-border p-5 rounded-md flex flex-col md:flex-row gap-4 items-end"
        >
          {" "}
          <div className="w-full md:w-1/3 space-y-1.5">
            {" "}
            <label className="text-sm font-semibold text-foreground">
              NIM
            </label>{" "}
            <input
              type="text"
              required
              placeholder="Contoh: 12345678"
              value={newNim}
              onChange={(e) => setNewNim(e.target.value)}
              className="w-full h-10 bg-background border border-border px-3 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />{" "}
          </div>{" "}
          <div className="w-full md:w-1/3 space-y-1.5">
            {" "}
            <label className="text-sm font-semibold text-foreground">
              Nama Lengkap
            </label>{" "}
            <input
              type="text"
              required
              placeholder="Contoh: Budi Santoso"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full h-10 bg-background border border-border px-3 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />{" "}
          </div>{" "}
          <Button
            type="submit"
            disabled={loading}
            className="w-full md:w-auto h-10"
          >
            {" "}
            {loading ? "Menyimpan..." : "Simpan"}{" "}
          </Button>{" "}
        </form>
      )}{" "}
      <div className="bg-card border border-border rounded-md overflow-hidden">
        {" "}
        <div className="overflow-x-auto">
          {" "}
          <table className="w-full text-sm text-left">
            {" "}
            <thead className="bg-surface-muted text-foreground uppercase text-xs">
              {" "}
              <tr>
                {" "}
                <th className="px-6 py-4 font-semibold">NIM / Akun</th>{" "}
                <th className="px-6 py-4 font-semibold">Nama Lengkap</th>{" "}
                <th className="px-6 py-4 font-semibold">Hak Akses</th>{" "}
                <th className="px-6 py-4 font-semibold">Status Sandi</th>{" "}
                <th className="px-6 py-4 font-semibold text-right">
                  Aksi
                </th>{" "}
              </tr>{" "}
            </thead>{" "}
            <tbody className="divide-y divide-border">
              {" "}
              {users.map((u) => (
                <tr
                  key={u.id}
                  className="hover:bg-surface-muted/50 transition-colors"
                >
                  {" "}
                  <td className="px-6 py-4 font-mono font-medium">
                    {u.nim}
                  </td>{" "}
                  <td className="px-6 py-4">{u.name}</td>{" "}
                  <td className="px-6 py-4">
                    {" "}
                    <span
                      className={`px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider rounded-md border ${u.role === "ADMIN" ? "bg-primary/10 text-primary border-primary/20" : "bg-secondary text-muted-foreground border-border"}`}
                    >
                      {" "}
                      {u.role}{" "}
                    </span>{" "}
                  </td>{" "}
                  <td className="px-6 py-4">
                    {" "}
                    {u.isDefaultPassword ? (
                      <span className="text-amber-600 text-xs font-medium flex items-center gap-1.5">
                        {" "}
                        <AlertCircle className="w-3.5 h-3.5" /> Default{" "}
                      </span>
                    ) : (
                      <span className="text-emerald-600 text-xs font-medium flex items-center gap-1.5">
                        {" "}
                        <CheckCircle2 className="w-3.5 h-3.5" /> Aman{" "}
                      </span>
                    )}{" "}
                  </td>{" "}
                  <td className="px-6 py-4 flex items-center justify-end gap-2">
                    {" "}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleToggleRole(u.id, u.role, u.isSuperAdmin)
                      }
                      disabled={u.isSuperAdmin}
                      className="h-8 px-2 text-xs"
                      title="Ubah Hak Akses"
                    >
                      {" "}
                      <Shield className="w-3.5 h-3.5 mr-1.5" />{" "}
                      {u.role === "ADMIN"
                        ? "Cabut Admin"
                        : "Jadikan Admin"}{" "}
                    </Button>{" "}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleResetPassword(u.id, u.nim)}
                      disabled={u.isSuperAdmin}
                      className="h-8 px-2 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20"
                      title="Reset Sandi ke NIM"
                    >
                      {" "}
                      <KeyRound className="w-3.5 h-3.5" />{" "}
                    </Button>{" "}
                  </td>{" "}
                </tr>
              ))}{" "}
              {users.length === 0 && (
                <tr>
                  {" "}
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-muted-foreground"
                  >
                    {" "}
                    Belum ada data pengguna.{" "}
                  </td>{" "}
                </tr>
              )}{" "}
            </tbody>{" "}
          </table>{" "}
        </div>{" "}
      </div>{" "}
      <ConfirmDialog
        isOpen={!!confirmRoleConfig}
        onOpenChange={(open) => !open && setConfirmRoleConfig(null)}
        title="Ubah Hak Akses"
        description={`Apakah Anda yakin ingin mengubah hak akses pengguna ini menjadi ${confirmRoleConfig?.role}?`}
        confirmText="Ubah Hak Akses"
        onConfirm={executeToggleRole}
      />{" "}
      <ConfirmDialog
        isOpen={!!confirmResetConfig}
        onOpenChange={(open) => !open && setConfirmResetConfig(null)}
        title="Reset Kata Sandi"
        description={`Apakah Anda yakin ingin me-reset kata sandi pengguna ${confirmResetConfig?.nim} kembali ke default (NIM)?`}
        confirmText="Reset Sandi"
        isDestructive={true}
        onConfirm={executeResetPassword}
      />{" "}
    </div>
  );
}
