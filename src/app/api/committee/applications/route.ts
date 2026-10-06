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
  if (!(await checkAdmin()))
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const eventId = searchParams.get("eventId");
  if (!eventId)
    return NextResponse.json({ message: "eventId wajib" }, { status: 400 });
  try {
    const applications = await prisma.committeeApplication.findMany({
      where: { eventId },
      include: {
        user: { select: { name: true, nim: true } },
        division1: { select: { name: true } },
        division2: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(applications);
  } catch (error) {
    return NextResponse.json(
      { message: "Terjadi kesalahan sistem" },
      { status: 500 },
    );
  }
}
