import { NextResponse } from "next/server";
import { SignJWT } from "jose";
const secret = new TextEncoder().encode(
  process.env.JWT_SECRET_KEY || "sikom-rahasia-super-aman-123",
);
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const eventId = searchParams.get("eventId");
  if (!eventId)
    return NextResponse.json(
      { message: "Event ID required" },
      { status: 400 },
    ); /* Token kadaluarsa dalam 10 detik! Ini mencegah mahasiswa memfoto QR // dan membagikannya ke teman yang sedang bolos (Titip Absen) */
  const token = await new SignJWT({ eventId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("10s")
    .sign(secret);
  return NextResponse.json({ token });
}
