import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
const secret = new TextEncoder().encode(
  process.env.JWT_SECRET_KEY || "sikom-rahasia-super-aman-123",
);
export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const { payload } = await jwtVerify(token, secret);
    if (payload.role !== "ADMIN")
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    const { status } = await request.json(); /* "APPROVED" | "REJECTED" */
    const document = await prisma.document.findUnique({
      where: { id },
      include: { event: true },
    });
    if (!document)
      return NextResponse.json(
        { message: "Dokumen tidak ditemukan." },
        { status: 404 },
      );
    const updated = await prisma.document.update({
      where: { id },
      data: { status },
    });
    await prisma.auditLog.create({
      data: {
        userId: payload.sub as string,
        action: "DOCUMENT_STATUS_UPDATE",
        details: `Dokumen ${document.type} untuk kegiatan ${document.event.name} diubah menjadi ${status}`,
      },
    });
    return NextResponse.json({
      message: `Dokumen berhasil ${status === "APPROVED" ? "disetujui" : "ditolak"}.`,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Terjadi kesalahan internal server." },
      { status: 500 },
    );
  }
}
