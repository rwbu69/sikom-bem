import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
const secret = new TextEncoder().encode(
  process.env.JWT_SECRET_KEY || "sikom-rahasia-super-aman-123",
);
async function checkAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload.role === "ADMIN";
  } catch {
    return false;
  }
}
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (!(await checkAdmin()))
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await context.params;
    await prisma.announcement.delete({ where: { id } });
    return NextResponse.json({ message: "Pengumuman dihapus." });
  } catch (error) {
    return NextResponse.json(
      { message: "Terjadi kesalahan." },
      { status: 500 },
    );
  }
}
