import createMiddleware from "next-intl/middleware";
import { routing } from "./lib/routing";

/**
 * Middleware next-intl – działa jak "strażnik" przed każdą stroną.
 * Jeśli wchodzisz na "/" → przekierowuje na "/pl/"
 * Jeśli wchodzisz na "/en/projects" → zostaje "/en/projects"
 */
export default createMiddleware(routing);

export const config = {
  // Middleware odpala się na wszystkich ścieżkach oprócz plików statycznych i API
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
