import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
const secret = new TextEncoder().encode(
  process.env.JWT_SECRET_KEY || "sikom-rahasia-super-aman-123",
);
export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const { payload } = await jwtVerify(token, secret);
    if (payload.role !== "ADMIN")
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    const { ids, status } = await request.json();
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { message: "Tidak ada data yang dipilih." },
        { status: 400 },
      );
    }
    if (!["CONFIRMED", "REJECTED", "PENDING"].includes(status)) {
      return NextResponse.json(
        { message: "Status tidak valid." },
        { status: 400 },
      );
    }
    const updated = await prisma.registration.updateMany({
      where: { id: { in: ids } },
      data: { status },
    });
    return NextResponse.json({
      message: `${updated.count} data berhasil diperbarui menjadi ${status}.`,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Terjadi kesalahan sistem." },
      { status: 500 },
    );
  }
}
