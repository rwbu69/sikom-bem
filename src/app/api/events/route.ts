import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
const secret = new TextEncoder().encode(
  process.env.JWT_SECRET_KEY || "sikom-rahasia-super-aman-123",
);
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    let isAdmin = false;
    if (token) {
      try {
        const { payload } = await jwtVerify(token, secret);
        if (payload.role === "ADMIN") isAdmin = true;
      } catch {}
    }
    const events = await prisma.event.findMany({
      where: isAdmin ? undefined : { visibility: "UMUM" },
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { registrations: true } } },
    });
    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json(
      { message: "Terjadi kesalahan internal." },
      { status: 500 },
    );
  }
}
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const event = await prisma.event.create({
      data: {
        code: data.code,
        name: data.name,
        description: data.description,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        location: data.location || null,
        posterUrl: data.posterUrl || null,
        capacity: data.capacity ? parseInt(data.capacity) : null,
        status: data.status || "OPEN",
        visibility: data.visibility || "UMUM",
      },
    });
    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Gagal membuat kegiatan. Pastikan kode unik." },
      { status: 400 },
    );
  }
}
