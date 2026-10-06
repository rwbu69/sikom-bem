import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertCircle, Calendar, FileText } from "lucide-react";
import Link from "next/link";
export default async function AdminDashboard() {
  const events = await prisma.event.findMany({
    orderBy: { startDate: "asc" },
    take: 5,
  });
  const pendingDocs = await prisma.document.count({
    where: { status: "DRAFT" },
  });
  /* Asumsikan DRAFT = butuh review/upload lanjutan */ const totalRegistrations =
    await prisma.registration.count();
  return (
    <div className="space-y-8 w-full">
      {" "}
      <div>
        {" "}
        <h1 className="text-2xl font-heading mb-1 text-foreground">
          Ringkasan Operasional
        </h1>{" "}
        <p className="text-muted-foreground text-sm">
          Status kegiatan BEM dan hal-hal yang perlu ditindaklanjuti.
        </p>{" "}
      </div>{" "}
      <div className="grid gap-6 md:grid-cols-2">
        {" "}
        <Card className="border-border rounded-md shadow-none bg-primary text-primary-foreground">
          {" "}
          <CardHeader className="pb-2">
            {" "}
            <div className="flex items-center gap-2">
              {" "}
              <Calendar className="h-5 w-5" />{" "}
              <CardTitle className="text-lg">Kegiatan Aktif</CardTitle>{" "}
            </div>{" "}
          </CardHeader>{" "}
          <CardContent>
            {" "}
            <div className="text-4xl font-heading font-bold mt-2">
              {events.length}
            </div>{" "}
            <p className="text-sm opacity-80 mt-1">
              Acara dijadwalkan dalam waktu dekat
            </p>{" "}
          </CardContent>{" "}
        </Card>{" "}
        <Card className="border-border rounded-md shadow-none bg-card">
          {" "}
          <CardHeader className="pb-2">
            {" "}
            <div className="flex items-center gap-2 text-foreground">
              {" "}
              <FileText className="h-5 w-5 text-muted-foreground" />{" "}
              <CardTitle className="text-lg">Dokumen Pending</CardTitle>{" "}
            </div>{" "}
          </CardHeader>{" "}
          <CardContent>
            {" "}
            <div className="text-4xl font-heading font-bold mt-2 text-foreground">
              {pendingDocs}
            </div>{" "}
            <p className="text-sm text-muted-foreground mt-1">
              Arsip LPJ / Proposal yang belum disahkan
            </p>{" "}
            {pendingDocs > 0 && (
              <Link
                href="/admin/arsip"
                className="text-xs text-primary font-medium hover:underline mt-4 inline-block"
              >
                {" "}
                Tinjau Arsip →{" "}
              </Link>
            )}{" "}
          </CardContent>{" "}
        </Card>{" "}
      </div>{" "}
      <Card className="border-border rounded-md shadow-none">
        {" "}
        <CardHeader>
          {" "}
          <CardTitle className="text-lg">Jadwal Acara Terdekat</CardTitle>{" "}
        </CardHeader>{" "}
        <CardContent className="p-0">
          {" "}
          <Table>
            {" "}
            <TableHeader className="bg-surface-muted">
              {" "}
              <TableRow className="border-border">
                {" "}
                <TableHead className="font-semibold text-foreground">
                  Nama Kegiatan
                </TableHead>{" "}
                <TableHead className="font-semibold text-foreground">
                  Tanggal
                </TableHead>{" "}
                <TableHead className="font-semibold text-foreground">
                  Status
                </TableHead>{" "}
              </TableRow>{" "}
            </TableHeader>{" "}
            <TableBody>
              {" "}
              {events.length === 0 ? (
                <TableRow>
                  {" "}
                  <TableCell
                    colSpan={3}
                    className="h-24 text-center text-muted-foreground"
                  >
                    {" "}
                    Tidak ada kegiatan yang dijadwalkan.{" "}
                  </TableCell>{" "}
                </TableRow>
              ) : (
                events.map((event) => (
                  <TableRow key={event.id} className="border-border">
                    {" "}
                    <TableCell className="font-medium text-foreground">
                      {event.name}
                    </TableCell>{" "}
                    <TableCell className="text-muted-foreground">
                      {new Date(event.startDate).toLocaleDateString("id-ID")}
                    </TableCell>{" "}
                    <TableCell>
                      {" "}
                      <span className="text-xs px-2 py-1 bg-surface-muted text-muted-foreground font-mono rounded">
                        {" "}
                        {event.status}{" "}
                      </span>{" "}
                    </TableCell>{" "}
                  </TableRow>
                ))
              )}{" "}
            </TableBody>{" "}
          </Table>{" "}
        </CardContent>{" "}
      </Card>{" "}
    </div>
  );
}
