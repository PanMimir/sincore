import { getTranslations } from "next-intl/server";
import { Download, ShieldAlert, ExternalLink } from "lucide-react";
import { fetchLatestRelease, pickAsset } from "@/lib/releases";

/**
 * ReleaseDownload — dynamiczny przycisk pobierania aplikacji.
 *
 * Pobiera najnowszy release projektu prosto z GitHub API (logika w
 * lib/releases.ts). Po wydaniu nowej wersji na GitHubie strona zaktualizuje
 * się sama — bez edycji kodu i bez redeployu. Jeśli projekt nie ma release'u
 * z plikiem .exe/.zip, komponent nie renderuje nic.
 */

function formatSize(bytes: number): string {
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default async function ReleaseDownload({
  githubUrl,
  locale,
}: {
  githubUrl: string | null;
  locale: string;
}) {
  const release = await fetchLatestRelease(githubUrl);
  if (!release) return null;

  const asset = pickAsset(release.assets ?? []);
  if (!asset) return null;

  const t = await getTranslations({ locale, namespace: "projects" });
  const publishedDate = new Date(release.published_at).toLocaleDateString(
    locale === "pl" ? "pl-PL" : "en-GB",
    { year: "numeric", month: "long", day: "numeric" }
  );

  return (
    <div className="border-accent-primary/30 bg-accent-primary/5 mb-8 rounded-sincore-lg border p-6">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-xl font-bold text-text-primary">
          <Download size={20} className="text-accent-primary" />
          {t("download_title")}
        </h2>
        <span className="border-accent-primary/40 bg-accent-primary/10 rounded border px-2 py-1 font-mono text-sm text-accent-primary">
          {release.tag_name}
        </span>
      </div>

      <p className="mb-5 text-base leading-relaxed text-text-muted">
        {t("download_desc")}
      </p>

      <a
        href={asset.browser_download_url}
        className="inline-flex items-center gap-2 rounded-sincore-md bg-accent-primary px-6 py-3 font-mono text-base font-semibold text-neutral-950 transition-colors duration-fast hover:bg-accent-hover"
      >
        <Download size={18} />
        {t("download_cta")}
      </a>

      <p className="mt-3 font-mono text-sm text-text-muted">
        {asset.name} · {formatSize(asset.size)}
      </p>

      <div className="mt-5 space-y-2 border-t border-border-subtle pt-4">
        <p className="font-mono text-sm text-text-muted">
          {t("download_platform")} · {t("download_released")} {publishedDate}
        </p>
        <p className="text-text-muted/80 flex items-start gap-2 text-sm leading-relaxed">
          <ShieldAlert size={16} className="mt-0.5 shrink-0 text-warning-400" />
          {t("download_smartscreen")}
        </p>
        <a
          href={release.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-mono text-sm text-text-muted transition-colors duration-fast hover:text-accent-primary"
        >
          <ExternalLink size={14} />
          {t("download_all_releases")}
        </a>
      </div>
    </div>
  );
}
