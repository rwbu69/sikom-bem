import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const rows: any[] = body.data;
    let successCount = 0;
    let failedRows = [];
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const nim = row.nim?.toString().trim();
      const name = row.nama || row.name;
      if (!nim || !name) {
        failedRows.push({ row: i + 2, reason: "NIM atau Nama kosong" });
        continue;
      }
      try {
        const hashedPassword = await bcrypt.hash(nim, 10);
        await prisma.user.create({
          data: {
            nim,
            name,
            password: hashedPassword,
            role: "MAHASISWA",
            isDefaultPassword: true,
          },
        });
        successCount++;
      } catch (e: any) {
        if (e.code === "P2002") {
          failedRows.push({ row: i + 2, reason: `NIM ${nim} sudah terdaftar` });
        } else {
          failedRows.push({ row: i + 2, reason: "Gagal sistem" });
        }
      }
    }
    return NextResponse.json({
      message: `Import selesai. Berhasil: ${successCount}`,
      successCount,
      failedRows,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Terjadi kesalahan sistem." },
      { status: 500 },
    );
  }
}
