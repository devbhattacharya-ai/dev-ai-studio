import Link from "next/link";

export function Brand({ href = "/#top" }: { href?: string }) {
  return (
    <Link className="brand" href={href} aria-label="Dev AI Studio home">
      <span className="brand-symbol" aria-hidden="true">
        D<span>✦</span>
      </span>
      <span>
        DEV /<br />
        AI STUDIO
      </span>
    </Link>
  );
}
