"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function SpecialContent() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale as string ?? "pl";
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("sincore_special_access") !== "1") {
      router.replace(`/${locale}/contact`);
    } else {
      setReady(true);
    }
  }, [locale, router]);

  if (!ready) return null;

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center px-4">

      {/* Tło — subtelna czerwona poświata */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(185,28,28,0.15)_0%,_transparent_70%)] pointer-events-none" />

      <div className="relative z-10 text-center max-w-2xl mx-auto">

        <p className="font-mono text-red-800 text-xs tracking-widest mb-6 uppercase">
          — dostęp przyznany —
        </p>

        <h1 className="font-mono font-bold text-5xl sm:text-6xl text-red-600 mb-8 tracking-tight">
          usługi specjalne
        </h1>

        <div className="border border-red-900/50 bg-red-950/20 rounded-lg p-8 mb-12 text-left space-y-4">
          <p className="font-mono text-red-500/60 text-sm">
            {"// ta sekcja jest w budowie"}
          </p>
          <p className="font-mono text-red-300/40 text-sm">
            {"// treść zostanie uzupełniona"}
          </p>
          <p className="font-mono text-red-300/40 text-sm">
            {"// — Mimir"}
          </p>
        </div>

        <button
          onClick={() => {
            sessionStorage.removeItem("sincore_special_access");
            router.push(`/${locale}/contact`);
          }}
          className="font-mono text-xs text-red-900 hover:text-red-700 transition-colors tracking-widest uppercase"
        >
          {"$ exit"}
        </button>

      </div>
    </div>
  );
}
