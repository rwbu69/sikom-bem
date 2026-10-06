import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
export async function POST(request: Request) {
  try {
    const { eventId, nim, name, password } = await request.json();
    if (!eventId || !nim || !name || !password) {
      return NextResponse.json(
        { message: "NIM, Nama, dan Kata Sandi wajib diisi" },
        { status: 400 },
      );
    } /* Cek kegiatan */
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      return NextResponse.json(
        { message: "Kegiatan tidak ditemukan" },
        { status: 404 },
      );
    }
    if (event.visibility === "INTERNAL") {
      return NextResponse.json(
        {
          message:
            "Kegiatan ini bersifat internal dan tidak terbuka untuk umum.",
        },
        { status: 403 },
      );
    } /* Cari atau buat User otomatis (NIM sbg password default jika belum ada) */
    let user = await prisma.user.findUnique({ where: { nim } });
    if (!user) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user = await prisma.user.create({
        data: { nim, name, password: hashedPassword, role: "MAHASISWA" },
      });
    } /* Cek apakah sudah terdaftar */
    const existingReg = await prisma.registration.findUnique({
      where: { userId_eventId: { userId: user.id, eventId } },
    });
    if (existingReg) {
      return NextResponse.json(
        { message: "Kamu sudah terdaftar di kegiatan ini." },
        { status: 400 },
      );
    } /* Buat pendaftaran */
    await prisma.registration.create({
      data: { userId: user.id, eventId: eventId, status: "CONFIRMED" },
    });
    return NextResponse.json({ message: "Pendaftaran berhasil." });
  } catch (error) {
    return NextResponse.json(
      { message: "Terjadi kesalahan sistem di server" },
      { status: 500 },
    );
  }
}
