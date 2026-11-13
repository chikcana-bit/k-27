import type { CSSProperties } from "react";
import { sectionIndex, visibleSections, type Site, type UI } from "./content/schema";
import { SlugContext } from "./components/bits";
import { CallBar, DemoBar, Header } from "./components/Chrome";
import { About, Contacts, Footer, Hero, Prices, Principles, Promotions, Services, Work } from "./components/Sections";
import { useReveal } from "./hooks/useReveal";

/** Master template: everything business-specific comes from `site` (content/<slug>.json) and `ui` (content/ui.<locale>.json). */
export function App({ site, ui }: { site: Site; ui: UI }) {
  useReveal();
  const ids = visibleSections(site);
  const n = (id: Parameters<typeof sectionIndex>[1]) => sectionIndex(ids, id);
  const nav = (ui.nav as { id: string; label: string }[]).filter((x) => ids.includes(x.id as never));
  const theme = site.theme
    ? ({ "--accent": site.theme.accent, "--accent-hi": site.theme.accentHi, "--accent-deep": site.theme.accentDeep } as CSSProperties)
    : undefined;
  return (
    <SlugContext.Provider value={site.slug}>
      <div className="site" style={theme}>
        <a className="skip" href="#main">{ui.skip}</a>
        <div className="chrome">
          <DemoBar ui={ui} />
          <Header site={site} ui={ui} nav={nav} />
        </div>
        <main id="main" tabIndex={-1}>
          <Hero site={site} ui={ui} />
          <About site={site} ui={ui} idx={n("about")} />
          {ids.includes("services") && <Services site={site} ui={ui} idx={n("services")} />}
          {ids.includes("prices") && <Prices site={site} ui={ui} idx={n("prices")} />}
          {ids.includes("promotions") && <Promotions site={site} ui={ui} idx={n("promotions")} />}
          <Work site={site} ui={ui} idx={n("work")} />
          {ids.includes("principles") && <Principles site={site} ui={ui} idx={n("principles")} />}
          <Contacts site={site} ui={ui} idx={n("contacts")} />
        </main>
        <Footer site={site} ui={ui} nav={nav} />
        <CallBar site={site} ui={ui} />
      </div>
    </SlugContext.Provider>
  );
}
