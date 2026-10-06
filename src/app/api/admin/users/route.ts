import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        nim: true,
        name: true,
        role: true,
        isSuperAdmin: true,
        createdAt: true,
        isDefaultPassword: true,
      },
    });
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ message: "Terjadi kesalahan" }, { status: 500 });
  }
}
import bcrypt from "bcryptjs";
export async function POST(request: Request) {
  try {
    const { nim, name, role } = await request.json();
    if (!nim || !name) {
      return NextResponse.json(
        { message: "NIM dan Nama wajib diisi" },
        { status: 400 },
      );
    }
    const existingUser = await prisma.user.findUnique({ where: { nim } });
    if (existingUser) {
      return NextResponse.json(
        { message: "NIM sudah terdaftar" },
        { status: 400 },
      );
    }
    const hashedPassword = await bcrypt.hash(nim, 10);
    const newUser = await prisma.user.create({
      data: {
        nim,
        name,
        role: role || "MAHASISWA",
        password: hashedPassword,
        isDefaultPassword: true,
      },
    });
    return NextResponse.json({
      message: "Pengguna berhasil ditambahkan",
      user: newUser,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
