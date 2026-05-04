import { NextResponse, type NextRequest } from "next/server";

// Autenticação desabilitada — acesso livre ao sistema
export async function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
