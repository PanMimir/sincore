"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Download, Lock, ShieldAlert, Smartphone } from "lucide-react";

/**
 * ApkDownloadGate — pobieranie pliku APK za bramką hasła.
 *
 * Hasło sprawdza trasa /api/termopary po stronie serwera. Komponent wysyła tam
 * wpisane hasło i dopiero po poprawnej odpowiedzi dostaje adres pliku, na który
 * przekierowuje przeglądarkę (start pobierania). Bez poprawnego hasła adres
 * pliku nigdy nie trafia do klienta.
 */
export default function ApkDownloadGate() {
  const t = useTranslations("projects");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "done">(
    "idle",
  );

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!password || status === "loading") return;
    setStatus("loading");
    try {
      const res = await fetch("/api/termopary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setStatus("error");
        return;
      }
      const data: { url?: string } = await res.json();
      if (!data.url) {
        setStatus("error");
        return;
      }
      setStatus("done");
      // Start pobierania — APK ma typ MIME nierenderowalny w przeglądarce,
      // więc nawigacja na adres skutkuje pobraniem pliku.
      window.location.assign(data.url);
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="mb-8 rounded-sincore-lg border border-accent-primary/30 bg-accent-primary/5 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
        <h2 className="flex items-center gap-2 font-bold text-xl text-text-primary">
          <Smartphone size={20} className="text-accent-primary" />
          {t("apk_title")}
        </h2>
        <span className="font-mono text-sm px-2 py-1 rounded border border-accent-primary/40 bg-accent-primary/10 text-accent-primary">
          v1.0.0
        </span>
      </div>

      <p className="text-text-muted text-base leading-relaxed mb-5">
        {t("apk_desc")}
      </p>

      <form onSubmit={handleSubmit} className="flex flex-wrap items-stretch gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Lock
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (status === "error") setStatus("idle");
            }}
            placeholder={t("apk_password_placeholder")}
            aria-label={t("apk_password_placeholder")}
            autoComplete="off"
            className="w-full rounded-sincore-md border border-border-subtle bg-surface pl-9 pr-3 py-3 font-mono text-base text-text-primary placeholder:text-text-muted/60 outline-none focus:border-accent-primary transition-colors duration-fast"
          />
        </div>
        <button
          type="submit"
          disabled={status === "loading" || !password}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-sincore-md bg-accent-primary text-neutral-950 font-mono text-base font-semibold hover:bg-accent-hover transition-colors duration-fast disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download size={18} />
          {status === "loading" ? t("apk_loading") : t("apk_cta")}
        </button>
      </form>

      {status === "error" && (
        <p className="mt-3 font-mono text-sm text-error-400">{t("apk_error")}</p>
      )}
      {status === "done" && (
        <p className="mt-3 font-mono text-sm text-success-400">
          {t("apk_done")}
        </p>
      )}

      <div className="mt-5 pt-4 border-t border-border-subtle space-y-2">
        <p className="font-mono text-sm text-text-muted">{t("apk_platform")}</p>
        <p className="flex items-start gap-2 text-sm text-text-muted/80 leading-relaxed">
          <ShieldAlert size={16} className="mt-0.5 shrink-0 text-warning-400" />
          {t("apk_sideload")}
        </p>
      </div>
    </div>
  );
}
