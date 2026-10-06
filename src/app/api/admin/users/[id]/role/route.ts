import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = (await params).id;
    const { role } = await request.json();
    if (role !== "ADMIN" && role !== "MAHASISWA") {
      return NextResponse.json(
        { message: "Role tidak valid" },
        { status: 400 },
      );
    }
    const user = await prisma.user.update({ where: { id }, data: { role } });
    return NextResponse.json({ message: "Akses diubah" });
  } catch (error) {
    return NextResponse.json({ message: "Terjadi kesalahan" }, { status: 500 });
  }
}
