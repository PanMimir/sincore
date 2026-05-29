type BrandIconName = "deployment" | "data-flow" | "protocol" | "monitoring" | "community";

interface BrandIconProps {
  name: BrandIconName;
  className?: string;
}

const PATHS: Record<BrandIconName, React.ReactNode> = {
  deployment: (
    <>
      <path d="M12 3v12" />
      <path d="m8 7 4-4 4 4" />
      <rect x="4" y="15" width="16" height="6" rx="2" />
    </>
  ),
  "data-flow": (
    <>
      <path d="M4 7h10" />
      <path d="m11 4 3 3-3 3" />
      <path d="M20 17H10" />
      <path d="m13 14-3 3 3 3" />
      <circle cx="6" cy="17" r="2" />
      <circle cx="18" cy="7" r="2" />
    </>
  ),
  protocol: (
    <>
      <path d="M7 8h10M7 12h10M7 16h6" />
      <rect x="4" y="5" width="16" height="14" rx="2" />
    </>
  ),
  monitoring: (
    <>
      <path d="M4 14h3l2-5 3 9 2-6h6" />
      <rect x="3" y="4" width="18" height="16" rx="2" />
    </>
  ),
  community: (
    <>
      <circle cx="12" cy="5" r="2" />
      <circle cx="5" cy="18" r="2" />
      <circle cx="19" cy="18" r="2" />
      <path d="m10.5 6.5-4 10" />
      <path d="m13.5 6.5 4 10" />
      <path d="M7 18h10" />
    </>
  ),
};

export default function BrandIcon({ name, className }: BrandIconProps) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {PATHS[name]}
    </svg>
  );
}
