import Link from "next/link";
import { ArrowUpRight } from "./Icons";
import type { ReactNode, AnchorHTMLAttributes } from "react";

type Props = {
  href: string;
  children: ReactNode;
  className?: string;
  external?: boolean;
  showArrow?: boolean;
  srHint?: string;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "children" | "className">;

export function GhostLink({
  href,
  children,
  className = "",
  external,
  showArrow = true,
  srHint,
  ...rest
}: Props) {
  const cls = `ghost-link ${className}`.trim();
  const content = (
    <>
      <span>
        {children}
        {srHint ? <span className="sr-only">{srHint}</span> : null}
      </span>
      {showArrow ? <ArrowUpRight /> : null}
    </>
  );

  if (external || href.startsWith("http") || href.startsWith("tel:")) {
    return (
      <a
        className={cls}
        href={href}
        {...(href.startsWith("http")
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
        {...rest}
      >
        {content}
      </a>
    );
  }

  return (
    <Link className={cls} href={href} {...rest}>
      {content}
    </Link>
  );
}
