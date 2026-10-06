import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = (await params).id;
    /* Find user to get NIM for default password */ const user =
      await prisma.user.findUnique({ where: { id } });
    if (!user)
      return NextResponse.json(
        { message: "User tidak ditemukan" },
        { status: 404 },
      );
    const hashedPassword = await bcrypt.hash(user.nim, 10);
    await prisma.user.update({
      where: { id },
      data: { password: hashedPassword, isDefaultPassword: true },
    });
    return NextResponse.json({ message: "Kata sandi direset ke NIM" });
  } catch (error) {
    return NextResponse.json({ message: "Terjadi kesalahan" }, { status: 500 });
  }
}
