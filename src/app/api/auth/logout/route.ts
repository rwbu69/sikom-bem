import { NextResponse } from "next/server";
import { cookies } from "next/headers";
export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL("/login", request.url));
  response.cookies.delete("token");
  return response;
}
