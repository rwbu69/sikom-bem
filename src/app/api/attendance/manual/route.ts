import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
const secret = new TextEncoder().encode(
  process.env.JWT_SECRET_KEY || "sikom-rahasia-super-aman-123",
);
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const { payload } = await jwtVerify(token, secret);
    if (payload.role !== "ADMIN")
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    const adminId = payload.sub as string;
    const { nim, eventId, action } =
      await request.json(); /* action: "ADD" or "REMOVE" */
    const user = await prisma.user.findUnique({ where: { nim } });
    if (!user)
      return NextResponse.json(
        { message: "NIM tidak ditemukan." },
        { status: 404 },
      );
    const reg = await prisma.registration.findUnique({
      where: { userId_eventId: { userId: user.id, eventId } },
    });
    if (!reg)
      return NextResponse.json(
        { message: "Mahasiswa belum terdaftar di kegiatan ini." },
        { status: 400 },
      );
    if (action === "ADD") {
      await prisma.attendance.upsert({
        where: { userId_eventId: { userId: user.id, eventId } },
        update: { timestamp: new Date() },
        create: { userId: user.id, eventId },
      });
      await prisma.auditLog.create({
        data: {
          userId: adminId,
          action: "MANUAL_ATTENDANCE_ADD",
          details: `Menambahkan presensi manual untuk NIM: ${nim} di event: ${eventId}`,
        },
      });
      return NextResponse.json({
        message: "Presensi ditambahkan secara manual.",
      });
    }
    if (action === "REMOVE") {
      await prisma.attendance.deleteMany({
        where: { userId: user.id, eventId },
      });
      await prisma.auditLog.create({
        data: {
          userId: adminId,
          action: "MANUAL_ATTENDANCE_REMOVE",
          details: `Menghapus presensi manual untuk NIM: ${nim} di event: ${eventId}`,
        },
      });
      return NextResponse.json({ message: "Presensi berhasil dihapus." });
    }
    return NextResponse.json({ message: "Aksi tidak valid." }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { message: "Terjadi kesalahan internal server." },
      { status: 500 },
    );
  }
}
