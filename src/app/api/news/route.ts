import { NextResponse } from "next/server";

/** Nyheder ligger i Lovable Cloud (tabellen nyheder). Next-udgaven har ingen database. */
export async function GET() {
  return NextResponse.json([]);
}
