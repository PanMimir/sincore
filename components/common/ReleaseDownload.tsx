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
    { year: "numeric", month: "long", day: "numeric" },
  );

  return (
    <div className="mb-8 rounded-sincore-lg border border-accent-primary/30 bg-accent-primary/5 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
        <h2 className="flex items-center gap-2 font-bold text-lg text-text-primary">
          <Download size={18} className="text-accent-primary" />
          {t("download_title")}
        </h2>
        <span className="font-mono text-xs px-2 py-1 rounded border border-accent-primary/40 bg-accent-primary/10 text-accent-primary">
          {release.tag_name}
        </span>
      </div>

      <p className="text-text-muted text-sm leading-relaxed mb-5">
        {t("download_desc")}
      </p>

      <a
        href={asset.browser_download_url}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-sincore-md bg-accent-primary text-neutral-950 font-mono text-sm font-semibold hover:bg-accent-hover transition-colors duration-fast"
      >
        <Download size={16} />
        {t("download_cta")}
      </a>

      <p className="mt-3 font-mono text-xs text-text-muted">
        {asset.name} · {formatSize(asset.size)}
      </p>

      <div className="mt-5 pt-4 border-t border-border-subtle space-y-2">
        <p className="font-mono text-xs text-text-muted">
          {t("download_platform")} · {t("download_released")} {publishedDate}
        </p>
        <p className="flex items-start gap-2 text-xs text-text-muted/80 leading-relaxed">
          <ShieldAlert size={14} className="mt-0.5 shrink-0 text-warning-400" />
          {t("download_smartscreen")}
        </p>
        <a
          href={release.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-text-muted hover:text-accent-primary transition-colors duration-fast"
        >
          <ExternalLink size={12} />
          {t("download_all_releases")}
        </a>
      </div>
    </div>
  );
}
