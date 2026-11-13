// jsdom lacks matchMedia / IntersectionObserver
if (!window.matchMedia) (window as any).matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });
