# Автоватт — Автоэлектрика, Омск

Одностраничный сайт на общем шаблоне (Vite + React + TypeScript). Весь контент — в `content/avtovatt.json`,
оформление (скин «volt») — в `src/skins/`. Сайт — демонстрационный концепт: уведомление об этом показано на странице.

```bash
npm ci
npm run dev        # локальная разработка
npm test           # проверка контента по схеме
npm run build      # production-сборка в dist/
```

Публикация: GitHub Actions (`.github/workflows/deploy.yml`) собирает сайт и выкладывает его на GitHub Pages при каждом push в `main`.
Индексация поисковиками выключена (`seo.index: false` в контенте); чтобы включить — поставьте `true`.
