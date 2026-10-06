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
    /* Check if event has registrations or attendances */ const event =
      await prisma.event.findUnique({
        where: { id },
        include: {
          _count: { select: { registrations: true, attendances: true } },
        },
      });
    if (!event)
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    if (event._count.registrations > 0 || event._count.attendances > 0) {
      return NextResponse.json(
        {
          message:
            "Gagal menghapus: Kegiatan ini sudah memiliki pendaftar atau data presensi.",
        },
        { status: 400 },
      );
    }
    await prisma.event.delete({ where: { id } });
    return NextResponse.json({ message: "Kegiatan berhasil dihapus." });
  } catch (error) {
    return NextResponse.json(
      { message: "Terjadi kesalahan sistem." },
      { status: 500 },
    );
  }
}
export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (!(await checkAdmin()))
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await context.params;
    const data = await request.json();
    const updated = await prisma.event.update({
      where: { id },
      data: {
        code: data.code,
        name: data.name,
        description: data.description,
        location: data.location || null,
        posterUrl: data.posterUrl || null,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        capacity: data.capacity ? parseInt(data.capacity) : null,
        visibility: data.visibility || "UMUM",
      },
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { message: "Gagal mengubah kegiatan. Pastikan kode unik." },
      { status: 400 },
    );
  }
}
