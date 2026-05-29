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
        document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
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
    <div className="space-y-4 mb-20">
      {services.map((s) => {
        const isOpen = expanded === s.id;
        const isCommunity = s.status === "community";
        return (
          <article
            key={s.id}
            id={s.id}
            className={`scroll-mt-24 border rounded-sincore-xl bg-surface transition-colors duration-normal ${
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
              className="w-full flex items-start gap-4 p-6 text-left"
            >
              <div
                className={`shrink-0 p-2.5 border rounded-sincore-md ${
                  isCommunity
                    ? "bg-accent-primary/10 border-accent-primary/30"
                    : "bg-accent-primary/10 border-accent-primary/20"
                }`}
              >
                <BrandIcon name={s.icon} className="text-accent-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="font-mono text-xs text-accent-primary border border-accent-primary/30 px-2 py-0.5 rounded bg-accent-primary/5">
                    {s.tag}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-text-muted">
                    {labels.status}: {statusLabel(s.status)}
                  </span>
                </div>
                <h2 className="font-bold tracking-tight text-xl text-text-primary mb-2">
                  {s.title}
                </h2>
                <p className="text-sm text-text-secondary leading-relaxed">{s.desc}</p>
              </div>
              <ChevronDown
                size={20}
                className={`shrink-0 mt-2 text-text-muted transition-transform duration-normal ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isOpen && (
              <div
                id={`${s.id}-panel`}
                className="px-6 pb-6 pt-2 border-t border-border-subtle space-y-6"
              >
                <Section title={labels.user}>
                  <p className="text-sm text-text-secondary leading-relaxed">{s.user}</p>
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
                          className="font-mono text-xs text-text-secondary border border-border-subtle px-2.5 py-1 rounded bg-neutral-900/30"
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
                    className="inline-flex items-center gap-2 h-11 px-6 bg-accent-400 hover:bg-accent-300 active:bg-accent-500 text-neutral-950 font-mono font-bold text-sm rounded-sincore-md transition-all duration-fast ease-sincore-out hover:-translate-y-px"
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
      <h3 className="font-mono text-xs uppercase tracking-wider text-text-muted mb-2">{title}</h3>
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
          className={`text-sm leading-relaxed flex gap-2 ${
            muted ? "text-text-muted" : "text-text-secondary"
          }`}
        >
          <span className="text-accent-primary mt-1.5 shrink-0">·</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
