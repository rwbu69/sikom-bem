import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
const secret = new TextEncoder().encode(
  process.env.JWT_SECRET_KEY || "sikom-rahasia-super-aman-123",
);
export async function POST(request: Request) {
  try {
    /* 1. Autentikasi User */
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token)
      return NextResponse.json(
        { success: false, message: "Akses ditolak (Token hilang)" },
        { status: 401 },
      );
    let userId = "";
    try {
      const { payload } = await jwtVerify(token, secret);
      userId = payload.sub as string;
    } catch {
      return NextResponse.json(
        { success: false, message: "Akses ditolak (Token tidak valid)" },
        { status: 401 },
      );
    }
    /* 2. Ambil data Form */ const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;
    const eventId = data.get("eventId") as string;
    const type = (data.get("type") as string) || "LPJ";
    if (!file || !eventId) {
      return NextResponse.json(
        { success: false, message: "File dan Kegiatan wajib diisi" },
        { status: 400 },
      );
    }
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes); /* 3. Simpan ke public/uploads */
    const uploadDir = join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true }); /* Pastikan folder ada */
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const path = join(uploadDir, filename);
    await writeFile(path, buffer);
    const fileUrl = `/uploads/${filename}`; /* 4. Catat ke Database Prisma (Tabel Document) */
    const doc = await prisma.document.create({
      data: { eventId, type, status: "SUBMITTED", fileUrl, uploadedBy: userId },
    });
    return NextResponse.json({ success: true, url: fileUrl, document: doc });
  } catch (error) {
    console.error("Error Upload:", error);
    return NextResponse.json(
      { success: false, message: "Kesalahan internal server saat mengunggah" },
      { status: 500 },
    );
  }
}
