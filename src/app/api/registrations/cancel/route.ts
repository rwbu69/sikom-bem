import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
const secret = new TextEncoder().encode(
  process.env.JWT_SECRET_KEY || "sikom-rahasia-super-aman-123",
);
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const { payload } = await jwtVerify(token, secret);
    const nim = payload.nim as string;
    const userId = payload.sub as string;
    const { registrationId } = await request.json();
    const registration = await prisma.registration.findUnique({
      where: { id: registrationId },
    });
    if (!registration) {
      return NextResponse.json(
        { message: "Pendaftaran tidak ditemukan." },
        { status: 404 },
      );
    }
    if (registration.userId !== userId) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    if (registration.status === "CANCELED") {
      return NextResponse.json(
        { message: "Pendaftaran sudah dibatalkan sebelumnya." },
        { status: 400 },
      );
    }
    await prisma.registration.update({
      where: { id: registrationId },
      data: { status: "CANCELED" },
    });
    return NextResponse.json({ message: "Pendaftaran berhasil dibatalkan." });
  } catch (error) {
    return NextResponse.json(
      { message: "Terjadi kesalahan sistem." },
      { status: 500 },
    );
  }
}
