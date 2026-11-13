import { ArrowDown, ArrowRight, ArrowUpRight, Plus } from "lucide-react";
import { Fragment, useCallback, useEffect, useState } from "react";
import { fill, formatDate, formatPrice, mapUrl, plural, type Site, type UI } from "../content/schema";
import { BookButton, Photo, SectionHead, Status } from "./bits";
import { Lightbox } from "./Lightbox";

type P = { site: Site; ui: UI; idx?: string };

export function Hero({ site, ui }: P) {
  const { hero } = site;
  const phone = site.contacts.phones[0];
  const words = hero.title.replace(/\.$/, "").split(" ");
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">{hero.eyebrow}</p>
          <h1 id="hero-title" aria-label={hero.title}>
            {words.map((w, i) => (
              <span className="h1-line" key={i} aria-hidden="true">
                <span className="h1-word" style={{ ["--i" as string]: i }}>
                  {w}{i === words.length - 1 && <span className="accent-dot">.</span>}
                </span>
              </span>
            ))}
          </h1>
          <p className="hero-sub">{hero.subtitle}</p>
          <div className="hero-ctas">
            <BookButton e164={phone.e164} label={ui.book} aria={ui.bookAria} caption={ui.bookCaption} phone={phone.display} />
            <a className="btn btn-ghost" href="#services">{ui.ourServices} <ArrowRight size={16} aria-hidden="true" /></a>
          </div>
        </div>
        <figure className="hero-figure">
          <div className="hero-frame">
            <Photo name={hero.image} alt={site.images[hero.image].alt} sizes="(max-width: 1023px) 100vw, 42vw" eager pos="38% 60%" />
            <span className="crop crop-tl" aria-hidden="true" /><span className="crop crop-br" aria-hidden="true" />
          </div>
          <figcaption><Status kind="plain">{ui.illustrative}</Status></figcaption>
        </figure>
      </div>
      <div className="container hero-rail" aria-hidden="true">
        <span>{site.business.category}</span>
        <span className="rail-cue">{ui.scrollCue} <ArrowDown size={14} /></span>
        <span>{site.business.city}</span>
      </div>
    </section>
  );
}

export function About({ site, ui, idx }: P) {
  const { intro } = site;
  return (
    <section className="section" id="about" aria-labelledby="about-title">
      <div className="container">
        <SectionHead index={idx ?? ""} id="about-title" title={ui.aboutTitle} />
        <div className="about-grid">
          <div className="about-text reveal">
            <p className="statement">{intro.statement}</p>
            {intro.statementStatus === "concept" && <Status>{ui.concept}</Status>}
            <p className="about-body">{intro.body}</p>
          </div>
          <div className="ledger reveal" aria-labelledby="facts-title">
            <h3 className="ledger-title" id="facts-title">{ui.factsTitle}</h3>
            <dl>
              {intro.facts.map((f) => (
                <div className="ledger-row" key={f.label}>
                  <dt>{f.label}</dt>
                  <dd className={f.status !== "confirmed" ? "is-unconfirmed" : ""}>{f.value}</dd>
                </div>
              ))}
            </dl>
            {intro.facts.some((f) => f.status !== "confirmed") && <Status>{ui.needsConfirm}</Status>}
          </div>
        </div>
        <figure className="about-band reveal reveal-img">
          <Photo name={intro.image} alt={site.images[intro.image].alt} sizes="100vw" pos="50% 45%" />
          <figcaption><Status kind="plain">{ui.illustrative}</Status></figcaption>
        </figure>
      </div>
    </section>
  );
}

const priceRowId = (s: Site["services"][number]) => `price-${s.priceIds[0] ?? `${s.id}-q`}`;

export function Services({ site, ui, idx }: P) {
  // Services with known prices first so they get the largest slots (01, 02, 07).
  const listed = site.services.filter((s) => s.status !== "unverified");
  const rest = site.services.filter((s) => s.status === "unverified");
  const order = [listed[0], listed[1], ...rest.slice(0, 4), rest[4] ?? listed[2]].filter(Boolean);
  const extra = site.services.filter((s) => !order.includes(s));
  const cards = [...order, ...extra];
  return (
    <section className="section section-alt" id="services" aria-labelledby="services-title">
      <div className="container">
        <SectionHead index={idx ?? ""} id="services-title" title={ui.servicesTitle} note={site.servicesNote ? <p className="muted">{site.servicesNote}</p> : undefined} />
        <ul className="services-grid">
          {cards.map((s, i) => (
            <li key={s.id} className={`svc svc-${i + 1} reveal`} data-testid="service-card">
              <a href={`#${priceRowId(s)}`} className="svc-link" aria-label={`${s.title}: ${ui.more}`}>
                <div className="svc-img">
                  <Photo name={s.image} alt={site.images[s.image].alt} sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 40vw" />
                </div>
                <div className="svc-meta">
                  <div className="svc-top">
                    <span className="svc-index">{String(i + 1).padStart(2, "0")}</span>
                    <span className={`svc-flag ${s.status === "unverified" ? "is-unverified" : ""}`}>
                      {s.status === "unverified" ? ui.serviceUnverified : ui.serviceListed}
                    </span>
                  </div>
                  <h3>{s.title}</h3>
                  <p className="svc-short">{s.short}</p>
                  <span className="svc-more">{ui.more} <ArrowRight size={14} aria-hidden="true" /></span>
                </div>
              </a>
            </li>
          ))}
        </ul>
        <p className="credit-line"><Status kind="plain">{ui.illustrative}</Status></p>
      </div>
    </section>
  );
}

export function Prices({ site, ui, idx }: P) {
  const phone = site.contacts.phones[0];
  const detailsFor = (id: string) =>
    site.services.find((s) => s.priceIds.includes(id) || `${s.id}-q` === id)?.details ?? ui.pricesUnknown;
  const [open, setOpen] = useState<Record<string, string | null>>({});
  const [activeCat, setActiveCat] = useState(0);

  const openFromHash = useCallback(() => {
    const id = decodeURIComponent(location.hash.replace(/^#price-/, ""));
    site.prices.forEach((c, ci) => {
      if (c.items.some((i) => i.id === id)) { setOpen((o) => ({ ...o, [c.category]: id })); setActiveCat(ci); }
    });
  }, [site.prices]);
  useEffect(() => {
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, [openFromHash]);

  return (
    <section className="section" id="prices" aria-labelledby="prices-title">
      <div className="container">
        <SectionHead index={idx ?? ""} id="prices-title" title={ui.pricesTitle} />
        <div className="prices-grid">
          <aside className="prices-rail">
            <ul className="cat-chips">
              {site.prices.map((c, i) => (
                <li key={c.category}>
                  <a href={`#cat-${i}`} className={activeCat === i ? "is-active" : ""} onClick={() => setActiveCat(i)}>{c.category}</a>
                </li>
              ))}
            </ul>
            <p className="rail-note">{ui.pricesRail}</p>
          </aside>
          <div className="prices-list">
            {site.prices.map((c, ci) => (
              <div className="cat reveal" id={`cat-${ci}`} key={c.category}>
                <div className="cat-head">
                  <h3>{c.category}</h3>
                  <span className="label">{c.items.length} {plural(c.items.length, ui.count)}</span>
                </div>
                <ul>
                  {[...c.items].sort((a, b) => Number(b.amount !== null) - Number(a.amount !== null)).map((it) => {
                    const isOpen = open[c.category] === it.id;
                    return (
                      <li key={it.id} id={`price-${it.id}`} className={`price-row${isOpen ? " is-open" : ""}`} data-testid="price-row">
                        <button className="price-btn" aria-expanded={isOpen} aria-controls={`pd-${it.id}`}
                          onClick={() => setOpen((o) => ({ ...o, [c.category]: isOpen ? null : it.id }))}>
                          <span className="price-name">{it.title}</span>
                          <span className={`price-val${it.amount ? " has-price" : ""}`} data-testid="price-val">
                            {it.amount ? formatPrice(it, ui.priceFrom) : ui.pricesUnknown}
                          </span>
                          <Plus className="price-toggle" size={20} aria-hidden="true" />
                        </button>
                        <div className="price-details" id={`pd-${it.id}`} role="region" aria-label={it.title} hidden={!isOpen}>
                          <div>
                            <p>{detailsFor(it.id)}</p>
                            {it.amount && it.source && it.checkedAt && (
                              <p className="price-meta">
                                <Status>{fill(ui.priceMeta, { source: site.sources[it.source].label, date: formatDate(it.checkedAt, site.locale) })}</Status>
                              </p>
                            )}
                            <a className="text-link" href={`tel:${phone.e164}`}>{ui.callToBook} <ArrowRight size={14} aria-hidden="true" /></a>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
            {site.pricesNote && <p className="muted small">{site.pricesNote}</p>}
            <div className="prices-footer reveal">
              <p>{ui.pricesFooter}</p>
              <BookButton e164={phone.e164} label={ui.estimate} aria={ui.bookAria} caption={ui.bookCaption} phone={phone.display} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Work({ site, ui, idx }: P) {
  const [shown, setShown] = useState<number | null>(null);
  const items = site.portfolio;
  return (
    <section className="section section-alt" id="work" aria-labelledby="work-title">
      <div className="container">
        <SectionHead index={idx ?? ""} id="work-title" title={ui.workTitle} note={items.length ? undefined : <Status kind="dash">{ui.workStatus}</Status>} />
        {items.length === 0 ? (
          <div className="work-empty">
            <div className="work-text reveal">
              <p className="statement">{ui.workStatement}</p>
              <p className="muted">{ui.workBody}</p>
              <a className="text-link" href="#services">{ui.toServices} <ArrowRight size={14} aria-hidden="true" /></a>
            </div>
            <div className="mounts" aria-hidden="true">
              {[1, 2, 3].map((n) => (
                <div key={n} className={`mount mount-${n}`}>
                  <span className="crop crop-tl" /><span className="crop crop-tr" /><span className="crop crop-bl" /><span className="crop crop-br" />
                  <span className="mount-label mount-desktop">{String(n).padStart(2, "0")} — {ui.workFrame}</span>
                  <span className="mount-label mount-mobile">{ui.workMobileFrame}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <ul className="gallery">
              {items.map((p, i) => (
                <li key={p.src} className={`g-${(i % 5) + 1}`}>
                  <button className="g-btn" onClick={() => setShown(i)} aria-label={p.alt}>
                    <img src={p.src} alt={p.alt} loading="lazy" />
                  </button>
                </li>
              ))}
            </ul>
            {shown !== null && <Lightbox items={items} index={shown} onIndex={setShown} onClose={() => setShown(null)} ui={ui} />}
          </>
        )}
      </div>
    </section>
  );
}

export function Principles({ site, ui, idx }: P) {
  return (
    <section className="section" id="principles" aria-labelledby="principles-title">
      <div className="container">
        <SectionHead index={idx ?? ""} id="principles-title" title={ui.principlesTitle}
          note={site.principles.status === "concept" ? <Status>{ui.concept}</Status> : undefined} />
        <ol className="principles">
          {site.principles.items.map((p, i) => (
            <li key={p.title} className="principle reveal">
              <span className="p-num">{String(i + 1).padStart(2, "0")}</span>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** Rendered only for offers with confirmed terms that have not expired. */
export function Promotions({ site, ui, idx, today = new Date() }: P & { today?: Date }) {
  const live = site.promotions.filter((p) => new Date(p.validUntil + "T23:59:59Z") >= today);
  if (!live.length) return null;
  return (
    <section className="section" id="promotions" aria-labelledby="promotions-title">
      <div className="container">
        <SectionHead index={idx ?? ""} id="promotions-title" title={ui.promotionsTitle} />
        <ul className="promos">
          {live.map((p) => (
            <li key={p.title} className="promo">
              <span className="label">до {formatDate(p.validUntil, site.locale)}</span>
              <h3>{p.title}</h3><p>{p.terms}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Contacts({ site, ui, idx }: P) {
  const c = site.contacts;
  const phone = c.phones[0];
  const rows: [string, React.ReactNode, boolean][] = [
    [ui.address, c.address.display, c.address.status !== "confirmed"],
    [ui.hours, <span data-testid="hours">{c.hours.value ?? ui.hoursUnknown}</span>, c.hours.status !== "confirmed"],
    [ui.phone, c.phones.map((p) => <a key={p.e164} href={`tel:${p.e164}`} data-testid="phone-link">{p.display}</a>), phone.status !== "confirmed"],
    [ui.website, c.website.url ? <a href={c.website.url} target="_blank" rel="noopener noreferrer">{c.website.url}</a> : ui.websiteUnknown, false],
    ...c.social.map((s) => [s.label, <a href={s.url} target="_blank" rel="noopener noreferrer">{s.url}</a>, s.status !== "confirmed"] as [string, React.ReactNode, boolean]),
  ];
  return (
    <section className="section section-alt" id="contacts" aria-labelledby="contacts-title">
      <div className="container contacts-grid">
        <div className="contacts-main reveal">
          <span className="section-index" aria-hidden="true">{idx}</span>
          <h2 id="contacts-title">{ui.contactsTitle}</h2>
          <a className="big-phone" href={`tel:${phone.e164}`} data-testid="big-phone">{phone.display}</a>
          <p className="muted small">{ui.phoneOnly}</p>
          <div className="contacts-ctas">
            <BookButton e164={phone.e164} label={ui.book} aria={ui.bookAria} />
            <a className="btn btn-ghost" href={mapUrl(c.address.mapQuery)} target="_blank" rel="noopener noreferrer" data-testid="map-link"
              aria-label={`${ui.route} (${ui.external})`}>
              {ui.route} <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>
        </div>
        <dl className="contacts-ledger reveal">
          {rows.map(([label, value, unconf]) => (
            <div className="ledger-row" key={label}>
              <dt>{label}</dt>
              <dd className={unconf ? "is-unconfirmed" : ""}>{value}</dd>
              {unconf && <Status>{ui.needsConfirm}</Status>}
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export function Footer({ site, ui, nav }: P & { nav: { id: string; label: string }[] }) {
  const v = { name: site.business.name };
  const credits = Array.from(new Map(Object.values(site.images).map((i) => [i.credit.url, i.credit])).values());
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <p className="wordmark">{site.business.name}</p>
          <p className="muted small">{site.business.category}, {site.business.city}</p>
        </div>
        <nav aria-label="Разделы (подвал)">
          <ul>{nav.map((n) => <li key={n.id}><a href={`#${n.id}`}>{n.label}</a></li>)}</ul>
        </nav>
        <div className="footer-legal">
          <p className="footer-notice" data-testid="footer-notice">{ui.demoNotice}</p>
          <p className="small">{fill(ui.demoExplainer, v)}</p>
          <p className="small"><strong>{ui.removal}:</strong> {site.demo.removalContact ?? ui.removalPending}</p>
          <p className="small muted">{fill(ui.sourcesBody, { date: formatDate(site.checkedAt, site.locale) })}{" "}
            {Object.values(site.sources).map((s) => (
              <Fragment key={s.url}><a href={s.url} target="_blank" rel="noopener noreferrer">{s.label} ↗</a>{" "}</Fragment>
            ))}
          </p>
          <p className="small muted">{ui.privacy}</p>
          <p className="small muted">{ui.photosCredit}{" "}
            {credits.map((c, i) => (
              <Fragment key={c.url}><a href={c.url} target="_blank" rel="noopener noreferrer">{c.label} {i + 1}</a>{i < credits.length - 1 ? ", " : ` (${credits[0]?.license}).`}</Fragment>
            ))}
          </p>
        </div>
      </div>
    </footer>
  );
}
