import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
const secret = new TextEncoder().encode(
  process.env.JWT_SECRET_KEY || "sikom-rahasia-super-aman-123",
);
export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  let nim = "";
  try {
    const { payload } = await jwtVerify(token, secret);
    nim = payload.nim as string;
  } catch {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const user = await prisma.user.findUnique({ where: { nim } });
  if (!user)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  try {
    const data = await request.json();
    const { eventId, division1Id, division2Id, reason, experience, whatsapp } =
      data;
    if (!eventId || !division1Id || !reason || !whatsapp) {
      return NextResponse.json(
        { message: "Data tidak lengkap." },
        { status: 400 },
      );
    }
    const existingApp = await prisma.committeeApplication.findUnique({
      where: { userId_eventId: { userId: user.id, eventId } },
    });
    if (existingApp) {
      return NextResponse.json(
        { message: "Kamu sudah mendaftar panitia untuk acara ini." },
        { status: 400 },
      );
    } /* Save whatsapp to user profile automatically */
    await prisma.user.update({ where: { id: user.id }, data: { whatsapp } });
    const application = await prisma.committeeApplication.create({
      data: {
        userId: user.id,
        eventId,
        division1Id,
        division2Id: division2Id || null,
        reason,
        experience: experience || null,
        whatsapp,
        status: "PENDING",
      },
    });
    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Gagal mengirim aplikasi lamaran." },
      { status: 500 },
    );
  }
}
