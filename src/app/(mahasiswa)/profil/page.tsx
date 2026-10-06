import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import CancelButton from "./CancelButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
const secret = new TextEncoder().encode(
  process.env.JWT_SECRET_KEY || "sikom-rahasia-super-aman-123",
);
export default async function ProfilPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) {
    redirect("/login");
  }
  let nim = "";
  try {
    const { payload } = await jwtVerify(token, secret);
    nim = payload.nim as string;
  } catch (err) {
    redirect("/login");
  }
  const user = await prisma.user.findUnique({
    where: { nim },
    include: {
      registrations: {
        include: { event: true },
        orderBy: { event: { startDate: "desc" } },
      },
      attendances: { include: { event: true } },
      committeeApps: {
        include: { event: true, division1: true, division2: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });
  if (!user) redirect("/login");
  const attendanceCount = user.attendances.length;
  const registrationCount = user.registrations.length;
  const attendanceRate =
    registrationCount > 0
      ? Math.round((attendanceCount / registrationCount) * 100)
      : 0;
  const announcements = await prisma.announcement.findMany({
    orderBy: { createdAt: "desc" },
    take: 3,
  });
  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 pt-6">
      {" "}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
        {" "}
        <div>
          {" "}
          <h1 className="text-xl font-heading text-foreground">
            Halo, {user.name}
          </h1>{" "}
        </div>{" "}
        <form action="/api/auth/logout" method="POST">
          {" "}
          <button
            type="submit"
            className="text-sm font-semibold text-destructive"
          >
            {" "}
            Keluar{" "}
          </button>{" "}
        </form>{" "}
      </div>{" "}
      <div className="flex flex-col md:grid md:grid-cols-[300px_1fr] gap-8 items-start">
        {" "}
        {/* Kolom Kiri: Kartu Identitas & Statistik */}{" "}
        <div className="w-full md:sticky md:top-20 space-y-4">
          {" "}
          <div className="bg-primary rounded-md border border-border p-5 text-white">
            {" "}
            <div className="bg-card p-3 rounded-md mb-4 flex justify-center border border-border/20">
              {" "}
              <QRCodeSVG value={user.nim} size={160} />{" "}
            </div>{" "}
            <div>
              {" "}
              <p className="font-semibold text-sm leading-tight">
                {user.name}
              </p>{" "}
              <p className="font-mono text-xs opacity-90 mt-1">
                {user.nim}
              </p>{" "}
            </div>{" "}
          </div>{" "}
          <div className="pt-2">
            {" "}
            <p className="text-foreground text-sm font-heading">
              Hadir: {attendanceCount}{" "}
              <span className="text-muted-foreground text-xs font-sans">
                ({attendanceRate}%)
              </span>
            </p>{" "}
          </div>{" "}
        </div>{" "}
        {/* Kolom Kanan: Pengumuman & Riwayat */}{" "}
        <div className="w-full space-y-8">
          {" "}
          {/* Pengumuman Terbaru */}{" "}
          <div>
            {" "}
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">
              Pengumuman Terbaru
            </h2>{" "}
            {announcements.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Belum ada pengumuman.
              </p>
            ) : (
              <ul className="space-y-4">
                {" "}
                {announcements.map((ann, idx) => (
                  <li
                    key={ann.id}
                    className="border-b border-border pb-4 last:border-0 last:pb-0 flex justify-between gap-4 items-start"
                  >
                    {" "}
                    <div className="flex-1">
                      {" "}
                      <div className="flex gap-2 items-center mb-1">
                        {" "}
                        <h3 className="text-sm font-bold text-foreground">
                          {ann.title}
                        </h3>{" "}
                        {idx === 0 && (
                          <span className="bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded-sm uppercase font-bold">
                            Baru
                          </span>
                        )}{" "}
                      </div>{" "}
                      <p className="text-sm text-foreground line-clamp-2">
                        {ann.content}
                      </p>{" "}
                    </div>{" "}
                    <p className="text-xs text-muted-foreground shrink-0 mt-0.5">
                      {" "}
                      {new Date(ann.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}{" "}
                    </p>{" "}
                  </li>
                ))}{" "}
              </ul>
            )}{" "}
          </div>{" "}
          {/* Riwayat (Tabs) */}{" "}
          <div>
            {" "}
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">
              Riwayat Kegiatan
            </h2>{" "}
            <Tabs defaultValue="acara" className="w-full">
              {" "}
              <TabsList className="mb-4">
                {" "}
                <TabsTrigger value="acara">Pendaftaran Acara</TabsTrigger>{" "}
                <TabsTrigger value="kepanitiaan">Kepanitiaan</TabsTrigger>{" "}
              </TabsList>{" "}
              <TabsContent value="acara" className="space-y-4">
                {" "}
                {user.registrations.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Kamu belum mendaftar kegiatan apa pun. Lihat yang sedang
                    dibuka di Kalender.
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {" "}
                    {user.registrations.map((reg) => {
                      const isAttended = user.attendances.some(
                        (a) => a.eventId === reg.eventId,
                      );
                      return (
                        <li
                          key={reg.id}
                          className="flex justify-between items-start border-b border-border pb-3 last:border-0 last:pb-0"
                        >
                          {" "}
                          <div>
                            {" "}
                            <p className="text-sm font-semibold text-foreground">
                              {reg.event.name}
                            </p>{" "}
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {" "}
                              {new Date(reg.event.startDate).toLocaleDateString(
                                "id-ID",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                },
                              )}{" "}
                            </p>{" "}
                          </div>{" "}
                          {isAttended ? (
                            <span className="text-[11px] font-bold text-primary">
                              Hadir
                            </span>
                          ) : reg.status === "CANCELED" ? (
                            <span className="text-[11px] font-bold text-muted-foreground">
                              Dibatalkan
                            </span>
                          ) : reg.status === "REJECTED" ? (
                            <span className="text-[11px] font-bold text-destructive">
                              Ditolak
                            </span>
                          ) : (
                            <div className="flex flex-col items-end gap-1">
                              {" "}
                              <span className="text-[11px] font-bold text-foreground">
                                Terdaftar
                              </span>{" "}
                              <CancelButton registrationId={reg.id} />{" "}
                            </div>
                          )}{" "}
                        </li>
                      );
                    })}{" "}
                  </ul>
                )}{" "}
              </TabsContent>{" "}
              <TabsContent value="kepanitiaan" className="space-y-4">
                {" "}
                {user.committeeApps.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Kamu belum mendaftar kepanitiaan apa pun.
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {" "}
                    {user.committeeApps.map((app) => {
                      return (
                        <li
                          key={app.id}
                          className="flex justify-between items-start border-b border-border pb-3 last:border-0 last:pb-0"
                        >
                          {" "}
                          <div>
                            {" "}
                            <p className="text-sm font-semibold text-foreground">
                              {app.event.name}
                            </p>{" "}
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {" "}
                              Pilihan 1: {app.division1.name}{" "}
                              {app.division2
                                ? `| Pilihan 2: ${app.division2.name}`
                                : ""}{" "}
                            </p>{" "}
                          </div>{" "}
                          {app.status === "PENDING" ? (
                            <span className="text-[11px] font-bold text-muted-foreground">
                              Proses Seleksi
                            </span>
                          ) : app.status === "ACCEPTED_DIV1" ? (
                            <span className="text-[11px] font-bold text-primary">
                              Diterima (Pilihan 1)
                            </span>
                          ) : app.status === "ACCEPTED_DIV2" ? (
                            <span className="text-[11px] font-bold text-primary">
                              Diterima (Pilihan 2)
                            </span>
                          ) : (
                            <span className="text-[11px] font-bold text-destructive">
                              Ditolak
                            </span>
                          )}{" "}
                        </li>
                      );
                    })}{" "}
                  </ul>
                )}{" "}
              </TabsContent>{" "}
            </Tabs>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
