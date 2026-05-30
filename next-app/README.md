# Sofia Kantser - Next.js SSG Landing

Целевая версия лендинга на Next.js 15 (App Router, SSG, i18n, FB Pixel).

> Перед работой читай `../Agents.md` - основной контекстный документ.

## Быстрый старт

```bash
cd next-app
npm install
cp .env.example .env.local   # затем впиши NEXT_PUBLIC_FB_PIXEL_ID
npm run dev                  # http://localhost:3000
```

## Скрипты

| Команда | Что делает |
|---|---|
| `npm run dev` | Dev-сервер с HMR |
| `npm run build` | SSG-сборка в `./out/` |
| `npm run lint` | ESLint check |
| `npm run typecheck` | TypeScript check без эмита |

## Структура

```
next-app/
├── public/                    # статика (сейчас 39 МБ - видео + фото)
├── src/
│   ├── app/
│   │   ├── [locale]/         # динамический сегмент локали
│   │   │   ├── layout.tsx    # next-intl provider + FB Pixel
│   │   │   ├── page.tsx      # композиция секций
│   │   │   └── not-found.tsx
│   │   ├── layout.tsx        # root html, шрифты, метаданные
│   │   └── globals.css       # CSS-переменные брендa
│   ├── components/            # один файл = один компонент
│   ├── i18n/
│   │   ├── routing.ts        # locales + defaultLocale
│   │   ├── request.ts        # next-intl config
│   │   └── messages/         # ru.json / en.json / ro.json (145 ключей)
│   └── lib/
│       └── fbpixel.ts        # обёртка для FB Pixel событий
├── middleware.ts             # next-intl middleware
├── next.config.mjs           # output: 'export', basePath: '/sofia-kantser'
└── tsconfig.json
```

## i18n

- **Дефолт:** русский (без префикса URL)
- **English:** `/en/...`
- **Romanian:** `/ro/...`

Конфиг в `src/i18n/routing.ts`. Переводы в `src/i18n/messages/{ru,en,ro}.json`.

При правке текста сначала меняй `ru.json`, потом синхронизируй `en.json` + `ro.json`. Если перевод не готов - оставь TODO-комментарий рядом с использованием.

## Facebook Pixel

Переменная окружения: `NEXT_PUBLIC_FB_PIXEL_ID`. Хранится в `.env.local` (gitignored).
Если переменная пустая - Pixel **не подключается** (graceful degradation для локалки).

События трекаются в `src/lib/fbpixel.ts`:

| Функция | Где вызывается | Событие FB |
|---|---|---|
| `pageview()` | автоматически на route change | `PageView` |
| `trackCtaStart('nav'|'hero'|'forwho'|'results'|'final')` | клик на «Начать сейчас» | `InitiateCheckout` |
| `trackPlanClick('base'|'standard'|'vip')` | клик на тариф | `InitiateCheckout` |
| `trackGiftOpen()` | клик «Получить подарок» | `Lead` |
| `trackAccordionOpen(1|2|3)` | раскрытие карточек Результатов | `ViewContent` |
| `trackPricingView()` | скролл до Pricing (50% видимости) | `AddToCart` |
| `trackLangSwitch(locale)` | смена языка | `CustomizeProduct` |

## Деплой

GitHub Actions workflow в `.github/workflows/deploy-nextjs.yml` (ручной запуск через `workflow_dispatch`).

После завершения миграции:
1. Переключить триггер на `push` в `main`
2. В GitHub Repo Settings → Pages → Source → **GitHub Actions** (не branch)
3. Добавить секрет `NEXT_PUBLIC_FB_PIXEL_ID` в Repo Settings → Secrets and variables → Actions

## Статус миграции

### ✅ Phase 1 - Foundation (сделано)
- Скаффолд Next.js 15 + TS + App Router
- next-intl с pathnames (ru дефолт, en/ro с префиксом)
- 145 i18n-ключей × 3 языка извлечены из legacy
- FB Pixel scaffold + конкретные tracker'ы
- SSG export + basePath для GitHub Pages
- Components: `Preloader`, `Nav`, `LangToggle`, `Hero`, `HeroCTA`, `FacebookPixel`
- GitHub Actions workflow для деплоя

### ⏳ Phase 2 - Section migration (12 секций)
Мигрировать из `../index.html` (legacy) в компоненты:
1. `Ticker` - бегущая строка под hero
2. `ForWho` - 6 карточек "программа для тебя если"
3. `Results` - bento 5 карточек + 3 аккордеона с подмодулями
4. `Gift` - кнопка-раскрытие "Получить подарок"
5. `About` - 2 колонки фото + текст + brand marquee
6. `Portfolio` - слайдер 10 кейсов Сони
7. `Students` - слайдер 3 видео учениц 9:16
8. `Reviews` - слайдер 5 отзывов
9. `Pricing` - 3 тарифа (БАЗА/СТАНДАРТ/VIP)
10. `FinalCTA` - тёмный финальный экран
11. `Footer`
12. Глобальная BrandMarquee (используется в About)

### ⏳ Phase 3 - Cutover
- Перенаправить GitHub Pages с `/` на Next.js out
- Удалить `../index.html` (legacy)
- Архивировать конвертер `scripts/extract_i18n.py`
- Заменить `/sofia-kantser/` basePath на свой домен (если будет)
