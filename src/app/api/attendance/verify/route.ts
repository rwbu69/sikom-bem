import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
const secret = new TextEncoder().encode(
  process.env.JWT_SECRET_KEY || "sikom-rahasia-super-aman-123",
);
export async function POST(request: Request) {
  try {
    const { token } = await request.json();
    if (!token)
      return NextResponse.json(
        { message: "Token presensi tidak valid" },
        { status: 400 },
      ); /* 1. Verifikasi token QR (Anti-Titip Absen) */
    let eventId = "";
    try {
      const { payload } = await jwtVerify(token, secret);
      eventId = payload.eventId as string;
    } catch (err) {
      return NextResponse.json(
        {
          message:
            "QR Code sudah kadaluarsa! Silakan scan ulang dari layar proyektor.",
        },
        { status: 400 },
      );
    } /* 2. Verifikasi identitas (Mahasiswa harus sudah login) */
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("token")?.value;
    if (!sessionToken) {
      /* Buat pending_attendance berdurasi 5 menit */
      const { SignJWT } = await import("jose");
      const pendingToken = await new SignJWT({ eventId })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("5m")
        .sign(secret);
      cookieStore.set("pending_attendance", pendingToken, { maxAge: 300 });
      return NextResponse.json(
        { message: "Mengalihkan ke login...", requireLogin: true },
        { status: 401 },
      );
    }
    let nim = "";
    try {
      const { payload: sessionPayload } = await jwtVerify(sessionToken, secret);
      nim = sessionPayload.nim as string;
    } catch {
      return NextResponse.json(
        { message: "Sesi login tidak valid" },
        { status: 401 },
      );
    }
    const user = await prisma.user.findUnique({ where: { nim } });
    if (!user)
      return NextResponse.json(
        { message: "User tidak ditemukan" },
        { status: 404 },
      ); /* 3. Pastikan sudah daftar */
    const reg = await prisma.registration.findUnique({
      where: { userId_eventId: { userId: user.id, eventId } },
    });
    if (!reg)
      return NextResponse.json(
        { message: "Gagal: Anda belum mendaftar di acara ini." },
        { status: 403 },
      ); /* 4. Cegah presensi ganda */
    const existingAtt = await prisma.attendance.findUnique({
      where: { userId_eventId: { userId: user.id, eventId } },
    });
    if (existingAtt) {
      return NextResponse.json(
        { message: "Anda sudah melakukan presensi di acara ini." },
        { status: 400 },
      );
    } /* 5. Catat kehadiran */
    await prisma.attendance.create({ data: { userId: user.id, eventId } });
    return NextResponse.json({ message: "Berhasil absen!" });
  } catch (error) {
    return NextResponse.json(
      { message: "Kesalahan internal server" },
      { status: 500 },
    );
  }
}
