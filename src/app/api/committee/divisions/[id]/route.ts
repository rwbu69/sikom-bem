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
    /* Check if anyone applied */ const count =
      await prisma.committeeApplication.count({
        where: { OR: [{ division1Id: id }, { division2Id: id }] },
      });
    if (count > 0) {
      return NextResponse.json(
        {
          message: "Tidak dapat menghapus divisi yang sudah memiliki pelamar.",
        },
        { status: 400 },
      );
    }
    await prisma.committeeDivision.delete({ where: { id } });
    return NextResponse.json({ message: "Divisi berhasil dihapus." });
  } catch (error) {
    return NextResponse.json(
      { message: "Terjadi kesalahan sistem." },
      { status: 500 },
    );
  }
}
