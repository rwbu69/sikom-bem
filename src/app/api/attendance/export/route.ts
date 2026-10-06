import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const eventId = searchParams.get("eventId");
  if (!eventId) {
    return NextResponse.json({ message: "Event ID required" }, { status: 400 });
  }
  try {
    const attendees = await prisma.attendance.findMany({
      where: { eventId },
      orderBy: { timestamp: "asc" },
      include: { user: { select: { name: true, nim: true } } },
    });
    const data = attendees.map((a: any, index: number) => ({
      No: index + 1,
      NIM: a.user.nim,
      Nama: a.user.name,
      "Waktu Hadir": new Date(a.timestamp).toLocaleString("id-ID"),
      "Tipe Pencatatan": a.type === "QR" ? "Scan QR" : "Manual",
      "ID Admin Pencatat": a.adminId || "-",
    }));
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
