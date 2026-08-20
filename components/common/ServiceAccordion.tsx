"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDown, ArrowRight } from "lucide-react";
import BrandIcon from "@/components/common/BrandIcon";

type IconName = "deployment" | "data-flow" | "protocol" | "monitoring" | "community";

export interface Service {
  id: string;
  tag: string;
  title: string;
  desc: string;
  user: string;
  value: string[];
  includes: string[];
  excludes: string[];
  status: "present" | "future" | "community";
  portfolio: string[];
  icon: IconName;
}

interface Labels {
  user: string;
  value: string;
  includes: string;
  excludes: string;
  status: string;
  statusPresent: string;
  statusFuture: string;
  statusCommunity: string;
  portfolio: string;
  cardCta: string;
  expandAria: string;
  collapseAria: string;
}

interface Props {
  services: Service[];
  labels: Labels;
  contactHref: string;
}

export default function ServiceAccordion({ services, labels, contactHref }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash && services.some((s) => s.id === hash)) {
      setExpanded(hash);
      requestAnimationFrame(() => {
        document
          .getElementById(hash)
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, [services]);

  const toggle = (id: string) => {
    const next = expanded === id ? null : id;
    setExpanded(next);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (next) {
        url.hash = next;
      } else {
        url.hash = "";
      }
      window.history.replaceState(null, "", url.toString());
    }
  };

  const statusLabel = (status: Service["status"]) => {
    if (status === "present") return labels.statusPresent;
    if (status === "future") return labels.statusFuture;
    return labels.statusCommunity;
  };

  return (
    <div className="mb-20 space-y-4">
      {services.map((s) => {
        const isOpen = expanded === s.id;
        const isCommunity = s.status === "community";
        return (
          <article
            key={s.id}
            id={s.id}
            className={`scroll-mt-24 rounded-sincore-xl border bg-surface transition-colors duration-normal ${
              isCommunity
                ? "border-accent-primary/40 hover:border-accent-primary/60"
                : "border-border-subtle hover:border-border-strong"
            }`}
          >
            <button
              type="button"
              onClick={() => toggle(s.id)}
              aria-expanded={isOpen}
              aria-controls={`${s.id}-panel`}
              aria-label={isOpen ? labels.collapseAria : labels.expandAria}
              className="flex w-full items-start gap-4 p-6 text-left"
            >
              <div
                className={`shrink-0 rounded-sincore-md border p-2.5 ${
                  isCommunity
                    ? "bg-accent-primary/10 border-accent-primary/30"
                    : "bg-accent-primary/10 border-accent-primary/20"
                }`}
              >
                <BrandIcon name={s.icon} className="text-accent-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="border-accent-primary/30 bg-accent-primary/5 rounded border px-2 py-0.5 font-mono text-xs text-accent-primary">
                    {s.tag}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-text-muted">
                    {labels.status}: {statusLabel(s.status)}
                  </span>
                </div>
                <h2 className="mb-2 text-xl font-bold tracking-tight text-text-primary">
                  {s.title}
                </h2>
                <p className="text-sm leading-relaxed text-text-secondary">{s.desc}</p>
              </div>
              <ChevronDown
                size={20}
                className={`mt-2 shrink-0 text-text-muted transition-transform duration-normal ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isOpen && (
              <div
                id={`${s.id}-panel`}
                className="space-y-6 border-t border-border-subtle px-6 pb-6 pt-2"
              >
                <Section title={labels.user}>
                  <p className="text-sm leading-relaxed text-text-secondary">{s.user}</p>
                </Section>

                <Section title={labels.value}>
                  <BulletList items={s.value} />
                </Section>

                <Section title={labels.includes}>
                  <BulletList items={s.includes} />
                </Section>

                {s.excludes.length > 0 && (
                  <Section title={labels.excludes}>
                    <BulletList items={s.excludes} muted />
                  </Section>
                )}

                {s.portfolio.length > 0 && (
                  <Section title={labels.portfolio}>
                    <div className="flex flex-wrap gap-2">
                      {s.portfolio.map((item) => (
                        <span
                          key={item}
                          className="rounded border border-border-subtle bg-neutral-900/30 px-2.5 py-1 font-mono text-xs text-text-secondary"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </Section>
                )}

                <div className="pt-2">
                  <Link
                    href={contactHref}
                    className="inline-flex h-11 items-center gap-2 rounded-sincore-md bg-accent-400 px-6 font-mono text-sm font-bold text-neutral-950 transition-all duration-fast ease-sincore-out hover:-translate-y-px hover:bg-accent-300 active:bg-accent-500"
                  >
                    {labels.cardCta}
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-2 font-mono text-xs uppercase tracking-wider text-text-muted">
        {title}
      </h3>
      {children}
    </div>
  );
}

function BulletList({ items, muted = false }: { items: string[]; muted?: boolean }) {
  return (
    <ul className="space-y-1.5">
      {items.map((item, i) => (
        <li
          key={i}
          className={`flex gap-2 text-sm leading-relaxed ${
            muted ? "text-text-muted" : "text-text-secondary"
          }`}
        >
          <span className="mt-1.5 shrink-0 text-accent-primary">·</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
