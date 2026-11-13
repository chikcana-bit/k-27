import { ArrowUpRight, ChevronRight, Clock, Globe, ListChecks, MapPin, Navigation, Phone, Tag } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { fill, formatDate, formatRub, mapUrl, plural, visibleSections, type SectionId, type Site, type UI } from "../../content/schema";
import { openState, parseDaily, hhmm } from "../../content/hours";
import { BookButton, Photo, SlugContext, Status } from "../../components/bits";
import { CallBar, DemoBar } from "../../components/Chrome";
import { Footer } from "../../components/Sections";
import { Lightbox } from "../../components/Lightbox";
import { useInView } from "../../hooks/useReveal";

/**
 * «Карточка» design: a light, product-like business card. Layout patterns follow good directory cards (2GIS):
 * firm summary with an "open now" line and an action row, sticky section tabs, icon info rows, dotted-leader price list.
 * Content contract is identical to the «Ателье» design — only presentation differs.
 */
type P = { site: Site; ui: UI };
type Tab = { id: SectionId; label: string };

const priceRowId = (s: Site["services"][number]) => `price-${s.priceIds[0] ?? `${s.id}-q`}`;
const initials = (name: string) => name.replace(/[^\p{L}\p{N}]/gu, "").slice(0, 3).toUpperCase();

export function CardApp({ site, ui }: P) {
  const ids = visibleSections(site);
  const tabs: Tab[] = ids.map((id) => ({ id, label: ui.card.tabs[id] }));
  const chrome = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string>(ids[0]);
  useInView(ids, (v) => { const a = ids.find((id) => v.has(id)); if (a) setActive(a); });

  // Sticky chrome height drives scroll-margin so anchored sections are not hidden under it.
  useEffect(() => {
    const el = chrome.current; if (!el || !("ResizeObserver" in window)) return;
    const ro = new ResizeObserver(() => document.documentElement.style.setProperty("--chrome-h", `${el.offsetHeight}px`));
    ro.observe(el); return () => ro.disconnect();
  }, []);

  const theme = site.theme
    ? ({ "--accent": site.theme.accent, "--accent-hi": site.theme.accentHi, "--accent-deep": site.theme.accentDeep } as CSSProperties)
    : undefined;
  const phone = site.contacts.phones[0];

  return (
    <SlugContext.Provider value={site.slug}>
      <div className="site d-card" style={theme}>
        <a className="skip" href="#main">{ui.skip}</a>
        <div className="chrome" ref={chrome}>
          <DemoBar ui={ui} />
          <header className="appbar">
            <div className="container appbar-inner">
              <a className="brand" href="#top" aria-label={`${site.business.name} — в начало`}>
                <span className="brand-tile" aria-hidden="true">{initials(site.business.name)}</span>
                <span className="brand-text"><span className="brand-name">{site.business.name}</span><span className="brand-cat">{site.business.category}</span></span>
              </a>
              <a className="appbar-phone" href={`tel:${phone.e164}`}><Phone size={16} aria-hidden="true" />{phone.display}</a>
              <BookButton e164={phone.e164} label={ui.book} aria={ui.bookAria} className="appbar-book" />
            </div>
          </header>
          <nav className="tabs" aria-label={ui.card.tabsLabel}>
            <div className="container tabs-inner">
              <ul>
                {tabs.map((t) => (
                  <li key={t.id}><a className="tab" href={`#${t.id}`} aria-current={active === t.id ? "true" : undefined}>{t.label}</a></li>
                ))}
              </ul>
            </div>
          </nav>
        </div>
        <main id="main" tabIndex={-1}>
          <div className="container layout">
            <Firm site={site} ui={ui} />
            <div className="feed">
              <Overview site={site} ui={ui} />
              {ids.includes("services") && <Services site={site} ui={ui} />}
              {ids.includes("prices") && <Prices site={site} ui={ui} />}
              {ids.includes("promotions") && <Promotions site={site} ui={ui} />}
              <Work site={site} ui={ui} />
              {ids.includes("principles") && <Principles site={site} ui={ui} />}
              <Contacts site={site} ui={ui} />
            </div>
          </div>
        </main>
        <Footer site={site} ui={ui} nav={tabs} />
        <CallBar site={site} ui={ui} />
      </div>
    </SlugContext.Provider>
  );
}

function OpenNow({ site, ui }: P) {
  const h = site.contacts.hours;
  const daily = parseDaily(h.value);
  const [now, setNow] = useState(() => new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 60_000); return () => clearInterval(t); }, []);
  if (!h.value) return <p className="open-line is-unknown"><Clock size={16} aria-hidden="true" />{ui.hoursUnknown}</p>;
  const unconf = h.status !== "confirmed";
  if (!daily) return <p className="open-line"><Clock size={16} aria-hidden="true" />{fill(ui.card.hoursPlain, { value: h.value })}</p>;
  const st = openState(daily, site.business.timeZone, now);
  return (
    <p className={`open-line ${st.open ? "is-open" : "is-closed"}`} data-testid="open-now">
      <span className="dot" aria-hidden="true" />
      <span>{fill(st.open ? ui.card.openUntil : ui.card.closedUntil, { time: st.next })}</span>
      {unconf && <span className="open-src">· {ui.card.hoursSource}</span>}
    </p>
  );
}

function Firm({ site, ui }: P) {
  const { hero, contacts: c } = site;
  const phone = c.phones[0];
  return (
    <aside className="firm hero" id="top" aria-labelledby="hero-title">
      <figure className="cover">
        <Photo name={hero.image} alt={site.images[hero.image].alt} sizes="(max-width: 1023px) 100vw, 400px" eager pos="40% 55%" />
        <figcaption className="chip">{ui.illustrative}</figcaption>
      </figure>
      <div className="firm-body">
        <p className="firm-cat">{hero.eyebrow}</p>
        <h1 id="hero-title">{site.business.name}</h1>
        <OpenNow site={site} ui={ui} />
        <div className="actions">
          <BookButton e164={phone.e164} label={ui.book} aria={ui.bookAria} className="act-book" />
          <a className="btn btn-soft" href={mapUrl(c.address.mapQuery)} target="_blank" rel="noopener noreferrer" aria-label={`${ui.card.actRoute} (${ui.external})`}>
            <Navigation size={16} aria-hidden="true" />{ui.card.actRoute}
          </a>
          {site.prices.length > 0 && <a className="btn btn-soft" href="#prices"><Tag size={16} aria-hidden="true" />{ui.card.actPrices}</a>}
          {site.services.length > 0 && <a className="btn btn-soft" href="#services"><ListChecks size={16} aria-hidden="true" />{ui.card.actServices}</a>}
        </div>
        <p className="firm-sub">{hero.subtitle}</p>
        <dl className="info">
          <InfoRow icon={<MapPin size={18} />} label={ui.address} unconf={c.address.status !== "confirmed"} ui={ui}>{c.address.display}</InfoRow>
          <InfoRow icon={<Clock size={18} />} label={ui.hours} unconf={c.hours.status !== "confirmed"} ui={ui}>{c.hours.value ?? ui.hoursUnknown}</InfoRow>
          <InfoRow icon={<Phone size={18} />} label={ui.phone} unconf={phone.status !== "confirmed"} ui={ui}>
            {c.phones.map((p) => <a key={p.e164} href={`tel:${p.e164}`}>{p.display}</a>)}
          </InfoRow>
          <InfoRow icon={<Globe size={18} />} label={ui.website} ui={ui}>
            {c.website.url ? <a href={c.website.url} target="_blank" rel="noopener noreferrer">{c.website.url}</a> : ui.websiteUnknown}
          </InfoRow>
        </dl>
      </div>
    </aside>
  );
}

function InfoRow({ icon, label, children, unconf = false, ui }: { icon: ReactNode; label: string; children: ReactNode; unconf?: boolean; ui: UI }) {
  return (
    <div className="info-row">
      <span className="info-ico" aria-hidden="true">{icon}</span>
      <dt className="sr-only">{label}</dt>
      <dd>
        <span className="info-val">{children}</span>
        {unconf && <span className="info-flag">{ui.needsConfirm}</span>}
      </dd>
    </div>
  );
}

function Panel({ id, title, count, children, note }: { id: string; title: string; count?: number; children: ReactNode; note?: ReactNode }) {
  return (
    <section className="panel" id={id} aria-labelledby={`${id}-title`}>
      <header className="panel-head">
        <h2 id={`${id}-title`}>{title}{count ? <span className="count">{count}</span> : null}</h2>
        {note}
      </header>
      {children}
    </section>
  );
}

function Overview({ site, ui }: P) {
  const { intro } = site;
  return (
    <Panel id="about" title={ui.card.aboutTitle}>
      <blockquote className="quote">
        <p>{intro.statement}</p>
        {intro.statementStatus === "concept" && <footer><Status kind="dash">{ui.concept}</Status></footer>}
      </blockquote>
      <p className="body">{intro.body}</p>
      <h3 className="sub">{ui.card.factsTitle}</h3>
      <ul className="facts">
        {intro.facts.map((f) => (
          <li key={f.label} className={f.status !== "confirmed" ? "is-unconfirmed" : ""}>
            <span className="fact-label">{f.label}</span><span className="fact-val">{f.value}</span>
          </li>
        ))}
      </ul>
      <p className="muted small">{ui.card.factsNote}</p>
      <figure className="wide-photo">
        <Photo name={intro.image} alt={site.images[intro.image].alt} sizes="(max-width: 1023px) 100vw, 720px" pos="50% 45%" />
        <figcaption className="chip">{ui.illustrative}</figcaption>
      </figure>
    </Panel>
  );
}

function Services({ site, ui }: P) {
  // Services with a published price first.
  const list = [...site.services].sort((a, b) => Number(b.priceIds.length > 0) - Number(a.priceIds.length > 0));
  const priceOf = (s: Site["services"][number]) =>
    site.prices.flatMap((c) => c.items).find((i) => s.priceIds.includes(i.id) && i.amount)?.amount ?? null;
  return (
    <Panel id="services" title={ui.card.servicesTitle} count={list.length} note={site.servicesNote ? <p className="muted small">{site.servicesNote}</p> : undefined}>
      <ul className="svc-list">
        {list.map((s, i) => {
          const price = priceOf(s);
          return (
            <li key={s.id} className={`svc svc-${i + 1}`} data-testid="service-card">
              <a className="svc-link" href={`#${priceRowId(s)}`} aria-label={`${s.title}: ${ui.more}`}>
                <span className="svc-thumb"><Photo name={s.image} alt="" sizes="96px" /></span>
                <span className="svc-text">
                  <span className="svc-title">{s.title}</span>
                  <span className="svc-short">{s.short}</span>
                  <span className={`badge ${s.status === "unverified" ? "is-warn" : ""}`}>
                    {s.status === "unverified" ? ui.serviceUnverified : ui.serviceListed}
                  </span>
                </span>
                <span className="svc-price">{price ? formatRub(price) : ""}</span>
                <ChevronRight className="svc-chev" size={20} aria-hidden="true" />
              </a>
            </li>
          );
        })}
      </ul>
      <p className="muted small">{ui.card.thumbsNote}</p>
    </Panel>
  );
}

function Prices({ site, ui }: P) {
  const phone = site.contacts.phones[0];
  const total = site.prices.reduce((n, c) => n + c.items.length, 0);
  const detailsFor = (id: string) =>
    site.services.find((s) => s.priceIds.includes(id) || `${s.id}-q` === id)?.details ?? ui.pricesUnknown;
  const [open, setOpen] = useState<string | null>(null);
  const openFromHash = useCallback(() => {
    const id = decodeURIComponent(location.hash.replace(/^#price-/, ""));
    if (site.prices.some((c) => c.items.some((i) => i.id === id))) setOpen(id);
  }, [site.prices]);
  useEffect(() => {
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, [openFromHash]);

  return (
    <Panel id="prices" title={ui.card.pricesTitle} count={total} note={<p className="muted small">{ui.card.pricesHint}</p>}>
      <ul className="chips" aria-label={ui.card.pricesTitle}>
        {site.prices.map((c, i) => <li key={c.category}><a className="chip-link" href={`#pcat-${i}`}>{c.category}<span>{c.items.length}</span></a></li>)}
      </ul>
      {site.prices.map((c, ci) => (
        <div className="pcat" id={`pcat-${ci}`} key={c.category}>
          <h3 className="sub">{c.category} <span className="muted">· {c.items.length} {plural(c.items.length, ui.count)}</span></h3>
          <ul className="plist">
            {[...c.items].sort((a, b) => Number(b.amount !== null) - Number(a.amount !== null)).map((it) => {
              const isOpen = open === it.id;
              return (
                <li key={it.id} id={`price-${it.id}`} className={`price-row${isOpen ? " is-open" : ""}`} data-testid="price-row">
                  <button className="price-btn" aria-expanded={isOpen} aria-controls={`pd-${it.id}`} onClick={() => setOpen(isOpen ? null : it.id)}>
                    <span className="price-name">{it.title}</span>
                    <span className="leader" aria-hidden="true" />
                    <span className={`price-val${it.amount ? " has-price" : ""}`} data-testid="price-val">{it.amount ? formatRub(it.amount) : ui.pricesUnknown}</span>
                    <ChevronRight className="price-chev" size={18} aria-hidden="true" />
                  </button>
                  <div className="price-details" id={`pd-${it.id}`} role="region" aria-label={it.title} hidden={!isOpen}>
                    <p>{detailsFor(it.id)}</p>
                    {it.amount && it.source && it.checkedAt && (
                      <p className="price-meta">{fill(ui.priceMeta, { source: site.sources[it.source].label, date: formatDate(it.checkedAt, site.locale) })}</p>
                    )}
                    <a className="text-link" href={`tel:${phone.e164}`}>{ui.callToBook} <ArrowUpRight size={14} aria-hidden="true" /></a>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
      {site.pricesNote && <p className="muted small">{site.pricesNote}</p>}
      <div className="cta-strip">
        <p>{ui.pricesFooter}</p>
        <BookButton e164={phone.e164} label={ui.estimate} aria={ui.bookAria} caption={ui.bookCaption} phone={phone.display} />
      </div>
    </Panel>
  );
}

function Promotions({ site, ui }: P) {
  const live = site.promotions.filter((p) => new Date(p.validUntil + "T23:59:59Z") >= new Date());
  return (
    <Panel id="promotions" title={ui.promotionsTitle} count={live.length}>
      <ul className="promos">
        {live.map((p) => <li key={p.title}><strong>{p.title}</strong><p>{p.terms}</p><span className="muted small">до {formatDate(p.validUntil, site.locale)}</span></li>)}
      </ul>
    </Panel>
  );
}

function Work({ site, ui }: P) {
  const [shown, setShown] = useState<number | null>(null);
  const items = site.portfolio;
  return (
    <Panel id="work" title={ui.card.workTitle} count={items.length} note={items.length ? undefined : <Status kind="dash">{ui.workStatus}</Status>}>
      {items.length === 0 ? (
        <>
          <p className="body">{ui.card.workBody}</p>
          <ul className="tiles" aria-hidden="true">{[1, 2, 3, 4].map((n) => <li key={n}><span>{ui.card.workTile}</span></li>)}</ul>
        </>
      ) : (
        <>
          <ul className="gallery">
            {items.map((p, i) => <li key={p.src}><button className="g-btn" onClick={() => setShown(i)} aria-label={p.alt}><img src={p.src} alt={p.alt} loading="lazy" /></button></li>)}
          </ul>
          {shown !== null && <Lightbox items={items} index={shown} onIndex={setShown} onClose={() => setShown(null)} ui={ui} />}
        </>
      )}
    </Panel>
  );
}

function Principles({ site, ui }: P) {
  return (
    <Panel id="principles" title={ui.principlesTitle} note={site.principles.status === "concept" ? <Status kind="dash">{ui.concept}</Status> : undefined}>
      <ol className="plain-list">{site.principles.items.map((p) => <li key={p.title}><strong>{p.title}</strong> — {p.text}</li>)}</ol>
    </Panel>
  );
}

function Contacts({ site, ui }: P) {
  const c = site.contacts;
  const phone = c.phones[0];
  const daily = parseDaily(c.hours.value);
  const todayIdx = (new Date().getDay() + 6) % 7;
  return (
    <Panel id="contacts" title={ui.card.contactsTitle}>
      <div className="contact-grid">
        <div>
          <p className="addr"><MapPin size={18} aria-hidden="true" />{c.address.display}</p>
          {c.address.status !== "confirmed" && <span className="info-flag">{ui.needsConfirm}</span>}
          <a className="big-phone" href={`tel:${phone.e164}`} data-testid="big-phone">{phone.display}</a>
          <p className="muted small">{ui.phoneOnly}</p>
          <div className="actions">
            <BookButton e164={phone.e164} label={ui.book} aria={ui.bookAria} />
            <a className="btn btn-soft" href={mapUrl(c.address.mapQuery)} target="_blank" rel="noopener noreferrer" data-testid="map-link"
              aria-label={`${ui.route} (${ui.external})`}><Navigation size={16} aria-hidden="true" />{ui.route}</a>
          </div>
        </div>
        <div>
          <h3 className="sub">{ui.card.schedule}</h3>
          {daily ? (
            <table className="sched">
              <tbody>
                {ui.card.days.map((d: string, i: number) => (
                  <tr key={d} className={i === todayIdx ? "is-today" : ""}><th scope="row">{d}</th><td>{hhmm(daily.open)}–{hhmm(daily.close)}</td></tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p data-testid="hours">{c.hours.value ?? ui.hoursUnknown}</p>
          )}
          {daily && <p className="sr-only" data-testid="hours">{c.hours.value}</p>}
          {c.hours.value && c.hours.status !== "confirmed" && <span className="info-flag">{ui.needsConfirm}</span>}
        </div>
      </div>
    </Panel>
  );
}
