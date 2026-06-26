import { NextResponse } from "next/server";
import crypto from "crypto";

// Bramka pobierania APK aplikacji Termopary ITS-90.
//
// Hasło i adres pliku trzymane są wyłącznie po stronie serwera (zmienne
// środowiskowe). Klient nigdy nie widzi hasła ani URL-a pliku, dopóki nie poda
// poprawnego hasła — wtedy dostaje jednorazowo adres do pobrania. Plik leży na
// Vercel Blob pod nieodgadywalnym adresem (losowy sufiks), więc bez przejścia
// przez tę trasę nie da się go znaleźć.

export const runtime = "nodejs";

// Porównanie odporne na timing attack (i tak hasło jest słabe, ale taniej
// zrobić to dobrze niż tłumaczyć później czemu nie).
function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

export async function POST(req: Request) {
  const password = process.env.TERMOPARY_DOWNLOAD_PASSWORD;
  const url = process.env.TERMOPARY_APK_URL;

  if (!password || !url) {
    return NextResponse.json({ error: "not_configured" }, { status: 500 });
  }

  let body: { password?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const given = typeof body.password === "string" ? body.password : "";
  if (!given || !safeEqual(given, password)) {
    return NextResponse.json({ error: "invalid_password" }, { status: 401 });
  }

  return NextResponse.json({ url });
}
