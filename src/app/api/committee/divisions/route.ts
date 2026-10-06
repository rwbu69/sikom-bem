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
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const eventId = searchParams.get("eventId");
  if (!eventId)
    return NextResponse.json({ message: "eventId wajib" }, { status: 400 });
  try {
    const divisions = await prisma.committeeDivision.findMany({
      where: { eventId },
    });
    return NextResponse.json(divisions);
  } catch (error) {
    return NextResponse.json(
      { message: "Terjadi kesalahan sistem" },
      { status: 500 },
    );
  }
}
export async function POST(request: Request) {
  if (!(await checkAdmin()))
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  try {
    const data = await request.json();
    if (!data.eventId || !data.name) {
      return NextResponse.json(
        { message: "Kegiatan dan Nama Divisi wajib" },
        { status: 400 },
      );
    }
    const division = await prisma.committeeDivision.create({
      data: {
        eventId: data.eventId,
        name: data.name,
        quota: data.quota ? parseInt(data.quota) : null,
        customQuestion1: data.customQuestion1 || null,
        customQuestion2: data.customQuestion2 || null,
      },
    });
    return NextResponse.json(division, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Gagal membuat divisi" },
      { status: 500 },
    );
  }
}
