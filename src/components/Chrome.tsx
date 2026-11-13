import { Menu, Phone, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Site, UI } from "../content/schema";
import { useInView } from "../hooks/useReveal";
import { BookButton } from "./bits";

export function DemoBar({ ui }: { ui: UI }) {
  return (
    <div className="demo-bar" role="note" aria-label="Demo">
      <span className="demo-chip" aria-hidden="true">DEMO</span>
      <strong data-testid="demo-bar">{ui.demoNotice}</strong>
      <span className="demo-ru" lang="ru">{ui.demoNoticeRu}</span>
    </div>
  );
}

export function Header({ site, ui, nav }: { site: Site; ui: UI; nav: { id: string; label: string }[] }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const phone = site.contacts.phones[0];
  const ids = nav.map((n) => n.id);

  useInView(ids, (v) => setActive(ids.find((id: string) => v.has(id)) ?? ""));
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on(); window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    if (!open) return;
    const p = panel.current!;
    const focusables = () => Array.from(p.querySelectorAll<HTMLElement>("a,button"));
    focusables()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(false); toggle.current?.focus(); }
      if (e.key === "Tab") {
        const f = focusables(); const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
      <div className="container header-inner">
        <a className="wordmark" href="#top">{site.business.name}</a>
        <nav className="nav-desktop" aria-label="Разделы">
          <ul>
            {nav.map((n) => (
              <li key={n.id}><a href={`#${n.id}`} aria-current={active === n.id ? "true" : undefined}>{n.label}</a></li>
            ))}
          </ul>
        </nav>
        <BookButton e164={phone.e164} label={ui.book} aria={ui.bookAria} className="header-book" />
        <div className="header-mobile">
          <a className="icon-btn" href={`tel:${phone.e164}`} aria-label={ui.call}><Phone size={18} aria-hidden="true" /></a>
          <button ref={toggle} className="icon-btn menu-btn" aria-expanded={open} aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)} data-testid="menu-toggle">
            {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
            <span className="menu-label">{open ? ui.menuClose : ui.menuOpen}</span>
          </button>
        </div>
      </div>
      <div id="mobile-menu" ref={panel} className={`mobile-menu${open ? " is-open" : ""}`} hidden={!open}
        role="dialog" aria-modal="true" aria-label={ui.menuOpen} data-testid="mobile-menu">
        <nav aria-label="Разделы">
          <ol>
            {nav.map((n, i) => (
              <li key={n.id}>
                <a href={`#${n.id}`} onClick={() => setOpen(false)}>
                  <span className="mm-index">{String(i + 1).padStart(2, "0")}</span>{n.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <BookButton e164={phone.e164} label={ui.book} aria={ui.bookAria} caption={ui.bookCaption} phone={phone.display} className="mm-book" />
      </div>
    </header>
  );
}

export function CallBar({ site, ui }: { site: Site; ui: UI }) {
  const [show, setShow] = useState(false);
  useInView(["top", "contacts"], (v) => setShow(!v.has("top") && !v.has("contacts")), "0px 0px 0px 0px");
  return (
    <div className={`call-bar${show ? " is-shown" : ""}`} aria-hidden={!show} data-testid="call-bar">
      <a className="btn btn-primary" href={`tel:${site.contacts.phones[0].e164}`} tabIndex={show ? 0 : -1}>
        <Phone size={16} aria-hidden="true" /> {ui.call}
      </a>
    </div>
  );
}
