import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useRef } from "react";
import type { UI } from "../content/schema";

type Item = { src: string; alt: string; permission: string };

export function Lightbox({ items, index, onIndex, onClose, ui }:
  { items: Item[]; index: number; onIndex: (i: number) => void; onClose: () => void; ui: UI }) {
  const close = useRef<HTMLButtonElement>(null);
  const opener = useRef<Element | null>(null);
  const go = (d: number) => onIndex((index + d + items.length) % items.length);
  useEffect(() => {
    opener.current = document.activeElement;
    close.current?.focus();
    document.body.classList.add("menu-open");
    return () => { document.body.classList.remove("menu-open"); (opener.current as HTMLElement | null)?.focus?.(); };
  }, []);
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", k);
    return () => document.removeEventListener("keydown", k);
  });
  const it = items[index];
  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={it.alt} data-testid="lightbox">
      <button ref={close} className="icon-btn lb-close" onClick={onClose} aria-label={ui.lightboxClose}><X size={22} aria-hidden="true" /></button>
      {items.length > 1 && <button className="icon-btn lb-prev" onClick={() => go(-1)} aria-label={ui.lightboxPrev}><ChevronLeft size={26} aria-hidden="true" /></button>}
      <figure>
        <img src={it.src} alt={it.alt} />
        <figcaption>{index + 1} / {items.length} · {it.permission}</figcaption>
      </figure>
      {items.length > 1 && <button className="icon-btn lb-next" onClick={() => go(1)} aria-label={ui.lightboxNext}><ChevronRight size={26} aria-hidden="true" /></button>}
    </div>
  );
}
