// lib/releases.ts
// Wspólna logika pobierania release'ów z GitHuba. Używana przez komponent
// ReleaseDownload (przycisk na stronie projektu) oraz przez listy projektów
// (badge "do pobrania" na kartach).

export interface GithubAsset {
  name: string;
  browser_download_url: string;
  size: number;
}

export interface GithubRelease {
  tag_name: string;
  html_url: string;
  published_at: string;
  assets: GithubAsset[];
}

// Wyciąga "owner/repo" z pełnego URL-a GitHuba. null = nie da się ustalić.
export function parseRepo(githubUrl: string | null): string | null {
  if (!githubUrl) return null;
  const match = githubUrl.match(/github\.com\/([^/]+\/[^/]+?)(?:\.git)?\/?$/);
  return match ? match[1] : null;
}

// Pobiera najnowszy release projektu. revalidate: 1h — nowa wersja pojawi się
// na stronie w ciągu godziny od publikacji na GitHubie, bez redeployu.
// Powtórne wywołania dla tego samego repo trafiają w cache fetch Next.js.
export async function fetchLatestRelease(
  githubUrl: string | null,
): Promise<GithubRelease | null> {
  const repo = parseRepo(githubUrl);
  if (!repo) return null;
  try {
    const res = await fetch(
      `https://api.github.com/repos/${repo}/releases/latest`,
      {
        headers: { Accept: "application/vnd.github+json" },
        next: { revalidate: 3600 },
      },
    );
    if (!res.ok) return null;
    return (await res.json()) as GithubRelease;
  } catch {
    return null;
  }
}

// Wybiera plik do pobrania: najpierw instalowalny .exe, w razie braku .zip.
export function pickAsset(assets: GithubAsset[]): GithubAsset | null {
  return (
    assets.find((a) => a.name.toLowerCase().endsWith(".exe")) ??
    assets.find((a) => a.name.toLowerCase().endsWith(".zip")) ??
    null
  );
}

// Czy projekt ma gotowy plik do pobrania w najnowszym release.
export async function hasDownload(githubUrl: string | null): Promise<boolean> {
  const release = await fetchLatestRelease(githubUrl);
  return release !== null && pickAsset(release.assets ?? []) !== null;
}
