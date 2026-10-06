import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { verifyToken, signToken } from "@/lib/auth";
import { cookies } from "next/headers";
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const payload = await verifyToken(token);
    if (!payload || !payload.nim) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }
    const { newPassword } = await request.json();
    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { message: "Kata sandi tidak valid." },
        { status: 400 },
      );
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const user = await prisma.user.update({
      where: { nim: payload.nim as string },
      data: { password: hashedPassword, isDefaultPassword: false },
    }); /* Re-issue token without isDefaultPassword flag */
    const newToken = await signToken({
      sub: user.id,
      nim: user.nim,
      role: user.role,
      isDefaultPassword: false,
    });
    cookieStore.set("token", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24,
    });
    return NextResponse.json({
      message: "Kata sandi berhasil diubah",
      role: user.role,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Terjadi kesalahan internal." },
      { status: 500 },
    );
  }
}
