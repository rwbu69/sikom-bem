import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";
import { cookies } from "next/headers";
export async function POST(request: Request) {
  try {
    const { nim, password } = await request.json();
    if (!nim || !password) {
      return NextResponse.json(
        { message: "NIM dan Password wajib diisi." },
        { status: 400 },
      );
    }
    const user = await prisma.user.findUnique({ where: { nim } });
    if (!user) {
      return NextResponse.json(
        { message: "Akun tidak ditemukan." },
        { status: 401 },
      );
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: "Password salah." }, { status: 401 });
    }
    const token = await signToken({
      sub: user.id,
      nim: user.nim,
      role: user.role,
      isDefaultPassword: user.isDefaultPassword,
    });
    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24,
    });
    let attendanceMsg = null;
    const pendingCookie = cookieStore.get("pending_attendance")?.value;
    if (pendingCookie && !user.isDefaultPassword) {
      try {
        const { jwtVerify } = await import("jose");
        const secret = new TextEncoder().encode(
          process.env.JWT_SECRET_KEY || "sikom-rahasia-super-aman-123",
        );
        const { payload } = await jwtVerify(pendingCookie, secret);
        const eventId = payload.eventId as string;
        const reg = await prisma.registration.findUnique({
          where: { userId_eventId: { userId: user.id, eventId } },
        });
        if (reg) {
          const existingAtt = await prisma.attendance.findUnique({
            where: { userId_eventId: { userId: user.id, eventId } },
          });
          if (!existingAtt) {
            await prisma.attendance.create({
              data: { userId: user.id, eventId },
            });
            attendanceMsg = "Kehadiran berhasil direkam.";
          }
        }
      } catch (e) {
        /* invalid or expired pending token, ignore */
      }
      cookieStore.delete("pending_attendance");
    }
    return NextResponse.json({
      message: "Login Berhasil",
      role: user.role,
      isDefaultPassword: user.isDefaultPassword,
      attendanceMsg,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Terjadi kesalahan internal." },
      { status: 500 },
    );
  }
}
