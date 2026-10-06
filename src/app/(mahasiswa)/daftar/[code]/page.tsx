import prisma from "@/lib/prisma";
import RegistrationForm from "./RegistrationForm";
import { Calendar, Users, MapPin, Clock } from "lucide-react";
import { notFound } from "next/navigation";
export default async function PendaftaranPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const code = (await params).code;
  const event = await prisma.event.findUnique({
    where: { code },
    include: { _count: { select: { registrations: true } } },
  });
  if (!event) {
    notFound();
  }
  const isFull = event.capacity
    ? event._count.registrations >= event.capacity
    : false;
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      {" "}
      <div className="bg-card border border-border rounded-md w-full max-w-4xl grid md:grid-cols-2 overflow-hidden">
        {" "}
        {/* Kolom Kiri: Informasi Acara */}{" "}
        <div className="bg-surface-muted p-8 flex flex-col justify-between border-r border-border">
          {" "}
          <div>
            {" "}
            <div className="text-xs font-mono font-semibold text-muted-foreground mb-4 uppercase">
              {" "}
              Pendaftaran Dibuka{" "}
            </div>{" "}
            <h1 className="text-3xl font-heading text-foreground mb-4">
              {event.name}
            </h1>{" "}
            <p className="text-sm text-muted-foreground leading-relaxed mb-8">
              {" "}
              {event.description ||
                "Tidak ada deskripsi tambahan untuk kegiatan ini."}{" "}
            </p>{" "}
          </div>{" "}
          <div className="space-y-4">
            {" "}
            <div className="flex items-center gap-3 text-sm font-medium text-foreground">
              {" "}
              <Calendar className="w-4 h-4 text-muted-foreground" />{" "}
              <span>
                {new Date(event.startDate).toLocaleDateString("id-ID", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>{" "}
            </div>{" "}
            {event.capacity && (
              <div className="flex items-center gap-3 text-sm font-medium text-foreground">
                {" "}
                <Users className="w-4 h-4 text-muted-foreground" />{" "}
                <span>
                  Kuota: {event._count.registrations} / {event.capacity}{" "}
                  pendaftar
                </span>{" "}
              </div>
            )}{" "}
          </div>{" "}
        </div>{" "}
        {/* Kolom Kanan: Form Pendaftaran */}{" "}
        <div className="p-8 flex flex-col justify-center bg-card">
          {" "}
          {isFull ? (
            <div className="text-center py-8">
              {" "}
              <div className="w-12 h-12 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto mb-4">
                {" "}
                <Users className="w-6 h-6" />{" "}
              </div>{" "}
              <h3 className="text-xl font-heading text-foreground mb-2">
                Kuota Penuh
              </h3>{" "}
              <p className="text-sm text-muted-foreground">
                {" "}
                Pendaftaran untuk kegiatan ini sudah ditutup karena kuota
                maksimal telah terpenuhi.{" "}
              </p>{" "}
            </div>
          ) : (
            <RegistrationForm eventId={event.id} />
          )}{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
