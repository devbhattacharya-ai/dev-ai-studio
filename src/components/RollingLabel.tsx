import type { ReactNode } from "react";

/** Live Ig() — dual-span rolling label for nav hover. */
export function RollingLabel({ children }: { children: ReactNode }) {
  return (
    <span className="rolling-label">
      <span>{children}</span>
      <span aria-hidden="true">{children}</span>
    </span>
  );
}
