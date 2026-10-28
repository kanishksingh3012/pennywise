// 24px line icons, 1.75 stroke, drawn in currentColor.
const PATHS: Record<string, React.ReactNode> = {
  rent: <><path d="M4 11 12 4l8 7" /><path d="M6 10v10h12V10" /><path d="M10 20v-5h4v5" /></>,
  food: <><path d="M4 12h16a8 8 0 0 1-16 0Z" /><path d="M9 4c0 1.5 1 1.5 1 3M13 4c0 1.5 1 1.5 1 3" /></>,
  shopping: <><path d="M5 8h14l-1 12H6L5 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></>,
  bills: <><path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z" /><path d="M9 8h6M9 12h6M9 16h3" /></>,
  transport: <><rect x="5" y="4" width="14" height="13" rx="3" /><path d="M5 11h14M8 20l1-3M16 20l-1-3" /><circle cx="9" cy="14" r=".6" /><circle cx="15" cy="14" r=".6" /></>,
  other: <><circle cx="7" cy="12" r="1.2" /><circle cx="12" cy="12" r="1.2" /><circle cx="17" cy="12" r="1.2" /></>,
  home: <><path d="M4 11 12 4l8 7" /><path d="M6 10v10h12V10" /></>,
  activity: <><path d="M4 7h16M4 12h16M4 17h10" /></>,
  plan: <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4" /><circle cx="12" cy="12" r=".8" /></>,
  learn: <><path d="M4 5h6a2 2 0 0 1 2 2v13a2 2 0 0 0-2-2H4V5Z" /><path d="M20 5h-6a2 2 0 0 0-2 2v13a2 2 0 0 1 2-2h6V5Z" /></>,
  coin: <><circle cx="12" cy="12" r="8" /><path d="M10 8.5h3a2 2 0 0 1 0 4h-3V8.5Zm0 4V16" /></>,
  bell: <><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15L6 16Z" /><path d="M10 20a2 2 0 0 0 4 0" /></>,
  chevron: <path d="m9 6 6 6-6 6" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
};

export type IconName = keyof typeof PATHS;

export function Icon({ name, size = 24, className }: { name: IconName | string; size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {PATHS[name] ?? PATHS.other}
    </svg>
  );
}
