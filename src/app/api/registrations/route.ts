import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const eventId = searchParams.get("eventId");
  try {
    const registrations = await prisma.registration.findMany({
      where: eventId ? { eventId } : undefined,
      include: {
        user: { select: { name: true, nim: true } },
        event: { select: { name: true, code: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(registrations);
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching data" },
      { status: 500 },
    );
  }
}
export async function POST(request: Request) {
  try {
    const { eventId, nim, name } = await request.json();
    if (!eventId || !nim || !name) {
      return NextResponse.json(
        { message: "NIM, Nama, dan Kegiatan wajib diisi" },
        { status: 400 },
      );
    }
    let user = await prisma.user.findUnique({ where: { nim } });
    if (!user) {
      return NextResponse.json(
        {
          message:
            "NIM belum terdaftar di sistem SIKOM BEM. Silakan hubungi pengurus BEM.",
        },
        { status: 404 },
      );
    }
    const existingReg = await prisma.registration.findUnique({
      where: { userId_eventId: { userId: user.id, eventId } },
    });
    if (existingReg) {
      return NextResponse.json(
        { message: "Peserta sudah terdaftar di kegiatan ini." },
        { status: 400 },
      );
    }
    await prisma.registration.create({
      data: { userId: user.id, eventId: eventId, status: "CONFIRMED" },
    });
    return NextResponse.json({ message: "Peserta berhasil didaftarkan." });
  } catch (error) {
    return NextResponse.json(
      { message: "Terjadi kesalahan sistem server." },
      { status: 500 },
    );
  }
}
