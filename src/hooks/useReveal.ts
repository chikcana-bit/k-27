import { useEffect } from "react";

/** Adds `is-in` to every `.reveal` element once it is 15% visible. No-op when motion is reduced. */
export function useReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal:not(.is-in)"));
    if (!document.documentElement.classList.contains("motion") || !("IntersectionObserver" in window)) {
      els.forEach((e) => e.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } }),
      { threshold: 0.15 },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);
}

/** Returns ids of sections currently in view (for active nav + call bar visibility). */
export function useInView(ids: string[], cb: (visible: Set<string>) => void, rootMargin = "-40% 0px -55% 0px") {
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const vis = new Set<string>();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? vis.add(e.target.id) : vis.delete(e.target.id)));
      cb(new Set(vis));
    }, { rootMargin });
    ids.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join(","), rootMargin]);
}
