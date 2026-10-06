import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export async function POST(request: Request) {
  try {
    const { nim, eventId } = await request.json();
    if (!nim || !eventId) {
      return NextResponse.json(
        { message: "NIM dan Event ID diperlukan." },
        { status: 400 },
      );
    }
    const user = await prisma.user.findUnique({ where: { nim } });
    if (!user) {
      return NextResponse.json(
        { message: "NIM tidak terdaftar dalam sistem." },
        { status: 404 },
      );
    }
    /* Check if registered */ const registration =
      await prisma.registration.findUnique({
        where: { userId_eventId: { userId: user.id, eventId: eventId } },
      });
    if (!registration) {
      return NextResponse.json(
        { message: "Mahasiswa tidak terdaftar pada acara ini." },
        { status: 403 },
      );
    } /* Record attendance */
    const attendance = await prisma.attendance.upsert({
      where: { userId_eventId: { userId: user.id, eventId: eventId } },
      update: { timestamp: new Date() },
      create: { userId: user.id, eventId: eventId },
    });
    return NextResponse.json(
      {
        message: "Presensi berhasil dicatat!",
        user: { name: user.name, nim: user.nim },
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Terjadi kesalahan internal." },
      { status: 500 },
    );
  }
}
