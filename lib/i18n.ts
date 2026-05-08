import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  // requestLocale to Promise – czekamy na wartość
  let locale = await requestLocale;

  // Fallback na domyślny język jeśli locale jest nieprawidłowe lub brakuje
  if (!locale || !routing.locales.includes(locale as (typeof routing.locales)[number])) {
    locale = routing.defaultLocale;
  }

  const messages = (await import(`../translations/${locale}/index.json`)).default;

  return {
    locale,
    messages,
    timeZone: "Europe/Warsaw",
  };
});
