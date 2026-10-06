import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export async function GET() {
  try {
    const announcements = await prisma.announcement.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(announcements);
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
    const announcement = await prisma.announcement.create({
      data: { title: data.title, content: data.content },
    });
    return NextResponse.json(announcement, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Gagal membuat pengumuman." },
      { status: 400 },
    );
  }
}
