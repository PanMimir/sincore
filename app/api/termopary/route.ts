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

// ── Limit prób ────────────────────────────────────────────────────────────────
// Hasło jest krótkie i słownikowe, więc jedyne, co realnie chroni plik, to limit
// strzałów. Licznik siedzi w pamięci instancji funkcji: nie jest współdzielony
// między instancjami, ale zbija koszt ataku o rzędy wielkości i nic nie kosztuje.
// Twarde zabezpieczenie to reguła rate limitu w zaporze Vercela na tej ścieżce.
const WINDOW_MS = 60_000;
const MAX_ATTEMPTS = 5;
const attempts = new Map<string, number[]>();

function clientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}

/** Dopisuje próbę i mówi, czy limit został przekroczony. */
function overLimit(ip: string): boolean {
  const now = Date.now();
  const recent = (attempts.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  attempts.set(ip, recent);

  // Sprzątanie, żeby mapa nie rosła w nieskończoność na długo żyjącej instancji.
  if (attempts.size > 500) {
    attempts.forEach((times, key) => {
      if (times.every((t: number) => now - t >= WINDOW_MS)) attempts.delete(key);
    });
  }

  return recent.length > MAX_ATTEMPTS;
}

/**
 * Porównanie odporne na pomiar czasu. Skrót SHA-256 zrównuje długości, więc
 * czas odpowiedzi nie zdradza nawet tego, ile znaków ma prawdziwe hasło.
 */
function safeEqual(a: string, b: string): boolean {
  const ha = crypto.createHash("sha256").update(a, "utf8").digest();
  const hb = crypto.createHash("sha256").update(b, "utf8").digest();
  return crypto.timingSafeEqual(ha, hb);
}

export async function POST(req: Request) {
  const password = process.env.TERMOPARY_DOWNLOAD_PASSWORD;
  const url = process.env.TERMOPARY_APK_URL;

  if (!password || !url) {
    return NextResponse.json({ error: "not_configured" }, { status: 500 });
  }

  if (overLimit(clientIp(req))) {
    return NextResponse.json(
      { error: "too_many_attempts" },
      { status: 429, headers: { "Retry-After": String(WINDOW_MS / 1000) } }
    );
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
