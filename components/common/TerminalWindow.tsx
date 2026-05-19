"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TerminalLine {
  text: string;
  type: "command" | "output";
  href?: string;
}

interface TerminalWindowProps {
  lines: TerminalLine[];
  title?: string;
}

export default function TerminalWindow({
  lines,
  title = "sincore@terminal:~",
}: TerminalWindowProps) {
  const [visibleLines, setVisibleLines] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (visibleLines >= lines.length) return;
    const timer = setTimeout(() => {
      setVisibleLines((v) => v + 1);
    }, 600);
    return () => clearTimeout(timer);
  }, [visibleLines, lines.length]);

  useEffect(() => {
    const cursor = setInterval(() => {
      setShowCursor((v) => !v);
    }, 500);
    return () => clearInterval(cursor);
  }, []);

  return (
    <div className="rounded-sincore-lg border border-border-subtle bg-surface overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 bg-surface-elevated border-b border-border-subtle">
        <div className="w-2.5 h-2.5 rounded-full bg-error-500/70" />
        <div className="w-2.5 h-2.5 rounded-full bg-warning-500/70" />
        <div className="w-2.5 h-2.5 rounded-full bg-success-500/70" />
        <span className="ml-2 font-mono text-xs text-text-muted">{title}</span>
      </div>

      <div className="p-5 font-mono text-sm space-y-2 min-h-[180px]">
        {lines.slice(0, visibleLines).map((line, i) => (
          <div key={i}>
            {line.type === "command" ? (
              <p className="text-accent-primary">
                <span className="text-text-muted">❯ </span>
                {line.text}
              </p>
            ) : (
              <p className={cn("text-text-secondary pl-4", !line.text && "h-2")}>
                {line.href ? (
                  <a href={line.href} className="text-accent-primary hover:text-accent-hover hover:underline transition-colors duration-fast">
                    {line.text}
                  </a>
                ) : line.text}
              </p>
            )}
          </div>
        ))}

        {visibleLines <= lines.length && (
          <div className="text-accent-primary">
            <span className="text-text-muted">❯ </span>
            <span
              className={cn(
                "inline-block w-2 h-4 bg-accent-primary align-middle transition-opacity duration-instant",
                showCursor ? "opacity-100" : "opacity-0"
              )}
            />
          </div>
        )}
      </div>
    </div>
  );
}
