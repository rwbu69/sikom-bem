"use client";
import { useState, useEffect } from "react";
import { ShieldAlert, Search, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
export default function AuditLogPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  useEffect(() => {
    fetch("/api/audit-logs")
      .then((res) => res.json())
      .then((data) => {
        setLogs(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, []);
  const filteredLogs = logs.filter(
    (log) =>
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.details?.toLowerCase().includes(search.toLowerCase()) ||
      log.user?.name.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <div className="space-y-6 w-full">
      {" "}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-4">
        {" "}
        <div>
          {" "}
          <h1 className="text-2xl font-bold text-foreground mb-1 flex items-center gap-2">
            {" "}
            <ShieldAlert className="w-6 h-6 text-indigo-600" /> Audit Log
            Sistem{" "}
          </h1>{" "}
          <p className="text-sm text-muted-foreground">
            Pantau dan telusuri riwayat aktivitas keamanan dan administratif di
            sistem BEM.
          </p>{" "}
        </div>{" "}
        <Button variant="outline" className="gap-2 shrink-0">
          {" "}
          <Download size={16} /> Unduh Laporan (.csv){" "}
        </Button>{" "}
      </div>{" "}
      <Card className="border-border rounded-md">
        {" "}
        <div className="p-4 border-b border-border bg-surface-muted flex flex-col sm:flex-row justify-between gap-4">
          {" "}
          <div className="relative w-full max-w-md">
            {" "}
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />{" "}
            <Input
              placeholder="Cari aksi, detail, atau nama admin..."
              className="pl-9 bg-card"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />{" "}
          </div>{" "}
        </div>{" "}
        <CardContent className="p-0 bg-card">
          {" "}
          <div className="overflow-x-auto">
            {" "}
            <Table>
              {" "}
              <TableHeader className="bg-surface-muted">
                {" "}
                <TableRow>
                  {" "}
                  <TableHead className="w-[180px]">Waktu</TableHead>{" "}
                  <TableHead className="w-[200px]">Pengguna (Admin)</TableHead>{" "}
                  <TableHead className="w-[250px]">Aktivitas</TableHead>{" "}
                  <TableHead>Detail / Perubahan</TableHead>{" "}
                </TableRow>{" "}
              </TableHeader>{" "}
              <TableBody>
                {" "}
                {loading ? (
                  <TableRow>
                    {" "}
                    <TableCell
                      colSpan={4}
                      className="h-32 text-center text-muted-foreground"
                    >
                      Memuat data log sistem...
                    </TableCell>{" "}
                  </TableRow>
                ) : filteredLogs.length === 0 ? (
                  <TableRow>
                    {" "}
                    <TableCell
                      colSpan={4}
                      className="h-32 text-center text-muted-foreground"
                    >
                      Tidak ada log yang sesuai dengan pencarian.
                    </TableCell>{" "}
                  </TableRow>
                ) : (
                  filteredLogs.map((log) => (
                    <TableRow
                      key={log.id}
                      className="hover:bg-surface-muted/50"
                    >
                      {" "}
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                        {" "}
                        {new Date(log.createdAt).toLocaleString("id-ID", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}{" "}
                      </TableCell>{" "}
                      <TableCell>
                        {" "}
                        <div className="font-semibold text-foreground text-sm">
                          {log.user?.name}
                        </div>{" "}
                        <div className="text-xs text-muted-foreground font-mono">
                          {log.user?.nim}
                        </div>{" "}
                      </TableCell>{" "}
                      <TableCell>
                        {" "}
                        <span className="inline-flex items-center px-2 py-1 rounded bg-indigo-50 text-indigo-700 text-[11px] font-bold uppercase tracking-wider">
                          {" "}
                          {log.action}{" "}
                        </span>{" "}
                      </TableCell>{" "}
                      <TableCell className="text-sm text-muted-foreground">
                        {" "}
                        {log.details}{" "}
                      </TableCell>{" "}
                    </TableRow>
                  ))
                )}{" "}
              </TableBody>{" "}
            </Table>{" "}
          </div>{" "}
        </CardContent>{" "}
      </Card>{" "}
    </div>
  );
}
