import { Phone } from "lucide-react";
import { createContext, useContext, type ReactNode } from "react";
import { fill, imgSrc } from "../content/schema";

/** Current site slug — used to resolve per-site image paths. */
export const SlugContext = createContext("avtovatt");

export function Status({ children, kind = "ring" }: { children: ReactNode; kind?: "ring" | "dash" | "plain" }) {
  return <span className={`status status-${kind}`}>{children}</span>;
}

export function SectionHead({ index, title, id, note }: { index: string; title: string; id: string; note?: ReactNode }) {
  return (
    <header className="section-head reveal">
      <span className="section-index" aria-hidden="true">{index}</span>
      <h2 id={id}>{title}</h2>
      {note && <div className="section-note">{note}</div>}
    </header>
  );
}

export function BookButton({ e164, label, aria, caption, phone, className = "" }:
  { e164: string; label: string; aria: string; caption?: string; phone?: string; className?: string }) {
  return (
    <span className={`book ${className}`}>
      <a className="btn btn-primary" href={`tel:${e164}`} aria-label={aria} data-testid="book">
        <Phone size={16} aria-hidden="true" /> {label}
      </a>
      {caption && phone && <span className="btn-caption">{fill(caption, { phone })}</span>}
    </span>
  );
}

export function Photo({ name, alt, sizes, className = "", eager = false, pos }:
  { name: string; alt: string; sizes: string; className?: string; eager?: boolean; pos?: string }) {
  const slug = useContext(SlugContext);
  return (
    <img
      className={className}
      src={imgSrc(slug, name, 1600)}
      srcSet={`${imgSrc(slug, name, 800)} 800w, ${imgSrc(slug, name, 1600)} 1600w`}
      sizes={sizes}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      {...(eager ? { fetchpriority: "high" } : {})}
      style={pos ? { objectPosition: pos } : undefined}
    />
  );
}
