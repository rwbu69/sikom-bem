import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const eventId = searchParams.get("eventId");
  if (!eventId) {
    return NextResponse.json({ message: "Event ID required" }, { status: 400 });
  }
  try {
    const totalRegistered = await prisma.registration.count({
      where: { eventId, status: "CONFIRMED" },
    });
    const totalAttended = await prisma.attendance.count({ where: { eventId } });
    const recentAttendees = await prisma.attendance.findMany({
      where: { eventId },
      orderBy: { timestamp: "desc" },
      take: 5,
      include: { user: { select: { name: true, nim: true } } },
    });
    return NextResponse.json({
      totalRegistered,
      totalAttended,
      recentAttendees,
    });
  } catch (error) {
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
