# Agents.md — Sofia Kantser · AI AI CONTENT

Главный документ для ИИ-агентов, работающих с этим проектом. Читай этот файл **первым** перед любыми изменениями.

---

## 1. Что это

Премиум-лендинг онлайн-курса по AI-контенту для брендов. Автор курса - **Sofia Kantser** (Молдова). Курс называется **AI AI CONTENT**. Продаётся в Молдове и СНГ, есть международная часть аудитории.

- **Прод-URL:** https://wurdeg.github.io/sofia-kantser/
- **GitHub:** https://github.com/Wurdeg/sofia-kantser
- **Текущая версия:** статический одностраничник `index.html` в корне (legacy, источник правды для контента и дизайна)
- **Целевая версия:** Next.js 15 SSG в `next-app/` (миграция в процессе)

## 2. Стек (целевой)

| Слой | Технология | Зачем |
|---|---|---|
| Framework | **Next.js 15** (App Router) | SSG, маршрутизация, RSC |
| Язык | **TypeScript** | строгая типизация |
| i18n | **next-intl** (pathnames) | 3 языка через URL префиксы |
| Стили | **CSS Modules + global vars** | сохраняем брендовые `--pink`, `--cream` из legacy |
| Рендеринг | `output: 'export'` (SSG) | статика, индексируется поисковиками, можно хостить где угодно |
| Шрифты | `next/font/google` (Manrope + Playfair Display) | оптимизированная загрузка без CLS |
| Изображения | `next/image` с `unoptimized: true` | требование статического экспорта |
| Аналитика | **Facebook Pixel** | через `NEXT_PUBLIC_FB_PIXEL_ID` env |
| Деплой | GitHub Pages (`gh-pages` branch через GH Actions) | бесплатно, привязано к домену клиента позже |

**НЕ используем:**
- Tailwind (legacy уже использует CSS-переменные, ломать дизайн не хотим)
- Серверный рендеринг (SSG only - GitHub Pages статичен)
- Серверные функции/middleware (несовместимо с `output: 'export'`)
- next/image оптимизацию (несовместимо со static export)

## 3. Структура папок (целевая)

```
next-app/
├── public/                      # копия из ../works/ + sofia.jpg + favicon + logo
│   ├── favicon.svg
│   ├── logo.svg
│   ├── sofia.jpg                # фото в hero
│   ├── IMG_9841.JPG             # фото в "об авторе"
│   └── works/
│       ├── IMG_7545.mp4         # видео учениц
│       ├── IMG_9518.mp4
│       ├── brands/*.png|svg     # 9 логотипов
│       └── portfolio/*.mp4|JPG  # 8 видео + 2 фото
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── layout.tsx       # html, body, FB Pixel, шрифты
│   │   │   ├── page.tsx         # композиция секций
│   │   │   └── not-found.tsx
│   │   └── globals.css          # CSS-переменные брендa
│   ├── components/              # PascalCase, один файл = один компонент
│   │   ├── Nav.tsx
│   │   ├── Preloader.tsx
│   │   ├── LangToggle.tsx
│   │   ├── Hero.tsx
│   │   ├── Ticker.tsx
│   │   ├── ForWho.tsx
│   │   ├── Results.tsx
│   │   ├── Gift.tsx
│   │   ├── About.tsx
│   │   ├── Portfolio.tsx
│   │   ├── Students.tsx
│   │   ├── Reviews.tsx
│   │   ├── Pricing.tsx
│   │   ├── FinalCTA.tsx
│   │   └── Footer.tsx
│   ├── i18n/
│   │   ├── routing.ts           # locales config, defaultLocale, localePrefix
│   │   ├── request.ts           # getRequestConfig для next-intl
│   │   └── messages/
│   │       ├── ru.json          # русский (дефолт, без префикса URL)
│   │       ├── en.json          # английский (/en/...)
│   │       └── ro.json          # румынский (/ro/...)
│   ├── lib/
│   │   └── fbpixel.ts           # обёртка для трекинга Pixel-событий
│   └── styles/                  # CSS Modules per-component
├── .env.example                 # шаблон, в репо
├── .env.local                   # реальные ключи, gitignored
├── next.config.mjs
├── package.json
└── tsconfig.json
```

## 4. Брендинг

CSS-переменные (`src/app/globals.css`):

```css
:root {
  --pink: #E8346A;
  --pink-light: #FF6B9D;
  --pink-pale: #FFF0F5;
  --pink-mid: #FFD6E8;
  --dark: #1A1218;
  --dark-mid: #2D1F28;
  --text: #1A1218;
  --text-muted: #7A6572;
  --white: #FFFFFF;
  --cream: #FDF8FA;
  --border: rgba(232, 52, 106, 0.15);
  --radius: 20px;
  --radius-sm: 12px;
}
```

**Шрифты:**
- **Playfair Display** (italic, 700) - заголовки, акценты
- **Manrope** (400-800) - основной текст, UI
- Подключать через `next/font/google` в root layout

**Тон оф войс:**
- "Ты" к читателю (не "Вы")
- Эмоционально, но без агрессии и кликбейта
- Конкретные цифры (от €250, 45 дней, 6 недель)
- Без длинных тире (—), вместо них обычный дефис (-) - предпочтение клиента

## 5. Структура страницы (порядок секций сверху вниз)

| # | Секция | Компонент | Заметки |
|---|---|---|---|
| 1 | Preloader | `Preloader.tsx` | монограмма "sk" с анимацией, скрывается через 2.4с |
| 2 | Nav | `Nav.tsx` | sticky, sofia kantser лого, LangToggle, CTA |
| 3 | Hero | `Hero.tsx` | бейдж "Старт в июне", h1, sub, CTA, фото справа |
| 4 | Ticker | `Ticker.tsx` | бегущая строка с 5 повторяющимися фразами |
| 5 | ForWho | `ForWho.tsx` | 6 карточек "программа для тебя если" |
| 6 | Results | `Results.tsx` | bento 5 карточек, **3 с аккордеоном** (карточки 01, 02, 03 раскрывают модули программы) |
| 7 | Gift | `Gift.tsx` | большая розовая кнопка "Получить подарок" → раскрывает 3 фичи |
| 8 | About | `About.tsx` | фото + текст + brand marquee (логотипы кругом, без бэкграунда) |
| 9 | Portfolio | `Portfolio.tsx` | слайдер 10 кейсов Сони (8 mp4 + 2 jpg), без подписей |
| 10 | Students | `Students.tsx` | слайдер 3 видео учениц 9:16, без подписей |
| 11 | Reviews | `Reviews.tsx` | слайдер 5 отзывов (Диана, Ева, Юля, Ангелина, Арина) |
| 12 | Pricing | `Pricing.tsx` | 3 тарифа (БАЗА/СТАНДАРТ/VIP), цены **скрыты** через display:none, кнопка "НАЧАТЬ СЕЙЧАС" |
| 13 | FinalCTA | `FinalCTA.tsx` | тёмный фон, "стать звездой AI-мира" |
| 14 | Footer | `Footer.tsx` | копирайт |

**Важно:** секция "Программа" (Curriculum) **удалена** - её 7 модулей интегрированы в аккордеоны Results (01 → модули 1-3, 02 → 4-5-7, 03 → 6).

## 6. Интернационализация (i18n)

### Локали и URL

- **ru** - дефолт, **без префикса**: `/`, `/about`, `/#pricing`
- **en** - префикс `/en`: `/en`, `/en/about`
- **ro** - префикс `/ro`: `/ro`, `/ro/about`

next-intl конфиг (`src/i18n/routing.ts`):

```ts
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['ru', 'en', 'ro'],
  defaultLocale: 'ru',
  localePrefix: 'as-needed'
});
```

### Конвенция ключей

Плоская, точечная, kebab-case-friendly:
```
nav.brand, nav.cases, nav.cta
hero.badge, hero.title, hero.sub, hero.tag
ticker.1, ticker.2, ticker.3, ticker.4, ticker.5
forwho.title, forwho.1...forwho.6
results.label, results.title, results.1..4, results.promise, results.promise2
results.metric.1..4
gift.btn, gift.text, gift.f1.title, gift.f1.desc, gift.f2..., gift.f3...
about.label, about.sign, about.photo.tag, about.p1, about.p2, about.p3, about.brands.label
portfolio.label, portfolio.title, portfolio.meta.video, portfolio.meta.shoot
students.label, students.title
reviews.label, reviews.title, reviews.subtitle
rev.1.name, rev.1.quote (5 учениц)
pricing.label, pricing.title, plan.popular
plan.base.{name,desc,sub,access}, plan.std.{...}, plan.vip.{...}
feat.1..feat.13 + feat.4.vip (специальная версия для VIP - "проверка ДЗ Соней")
cta.start
case.label (для "Кейс N" в портфолио)
preloader.caption
final.title, final.sub
footer.copy
step.1..7.{title,desc} (в аккордеонах Results)
```

**Где брать переводы:** в `index.html` (legacy) в `<script>` блоке есть объект `I18N` с тремя словарями RU/EN/RO. Копируем оттуда в JSON.

### HTML в строках

Ключи `*.title`, `*.sign`, `forwho.title`, etc. содержат `<em>` и `<br>` теги. В Next.js рендерим через `<RichText keys={t.raw('hero.title')} />` или `dangerouslySetInnerHTML` (после санитизации в build-time - переводы доверенные).

Рекомендуемая практика для next-intl - использовать `t.rich(...)` с компонентным маппингом:

```tsx
t.rich('hero.title', {
  em: (c) => <em>{c}</em>,
  br: () => <br/>
})
```

И тогда в JSON: `"hero.title": "Создавай AI-контент<br></br>для брендов и<br></br>зарабатывай <em>от €1500</em>"`.

## 7. Facebook Pixel

### Конфигурация

`.env.example`:
```
NEXT_PUBLIC_FB_PIXEL_ID=
```

`.env.local` (gitignored):
```
NEXT_PUBLIC_FB_PIXEL_ID=1234567890123456
```

### События для трекинга

| Где | Событие | Параметры |
|---|---|---|
| Загрузка страницы | `PageView` | автоматически на init |
| Клик CTA "Начать сейчас" (любой из 5+ кнопок) | `InitiateCheckout` | `{ content_category: 'course', value: 250, currency: 'EUR' }` (минимальный тариф) |
| Клик "Получить подарок" | `Lead` | `{ content_name: 'gift_opened' }` |
| Открытие аккордеона Results (01/02/03) | `ViewContent` | `{ content_name: 'result_${num}', content_category: 'curriculum' }` |
| Скролл до Pricing секции (intersection observer 50%) | `AddToCart` | `{ content_category: 'pricing_view' }` |
| Клик на тариф (любая кнопка plan-cta) | `InitiateCheckout` | `{ content_name: 'plan_${tier}', value: priceMap[tier], currency: 'EUR' }` |
| Смена языка через LangToggle | `CustomizeProduct` | `{ content_category: 'lang_switch', content_name: locale }` |

### Реализация

`src/lib/fbpixel.ts`:
```ts
export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID;

export const pageview = () => {
  if (typeof window === 'undefined' || !window.fbq) return;
  window.fbq('track', 'PageView');
};

export const event = (name: string, params?: Record<string, unknown>) => {
  if (typeof window === 'undefined' || !window.fbq) return;
  window.fbq('track', name, params);
};

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}
```

`src/components/FacebookPixel.tsx` - клиентский компонент с `<Script>` next.js, инициализирует fbq и трекает PageView на route change через `usePathname`.

Подключать в root `layout.tsx`. Если `FB_PIXEL_ID` пустой - **не рендерить ничего** (graceful degradation для локалки без ключа).

## 8. Build & Deploy

### Локально

```bash
cd next-app
npm install
npm run dev              # http://localhost:3000
npm run build            # генерирует ./out/
npm run start            # SSR проверка (не используется в проде)
```

### Production deploy

`next.config.mjs`:
```js
export default {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/sofia-kantser' : '',
  images: { unoptimized: true },
  trailingSlash: true   // GitHub Pages требует /folder/ а не /folder
};
```

GitHub Actions workflow `.github/workflows/deploy.yml`:
- триггер: push на `main`
- собирает Next.js в `out/`
- деплоит в ветку `gh-pages`
- Pages source: branch `gh-pages` /

**ВАЖНО:** при ssg+basePath все ссылки и пути к ассетам автоматически префиксуются `/sofia-kantser`. В коде писать без префикса (`<Link href="/about">`, `<Image src="/sofia.jpg">`).

## 9. Соглашения для агентов

### Edits
- При правке текстов сначала меняй в JSON-словарях (`messages/ru.json` главный), потом проверяй что en/ro синхронизированы. Если en/ro нет - запиши TODO в комментарии компонента.
- Никогда не редактируй `index.html` в корне для нового функционала - это legacy. Если правка нужна для прода до завершения миграции - правь legacy + Next.js параллельно.
- Не используй `any` в TS. Если тип неясен - `unknown` + type guard.
- Каждый компонент - один файл. Не больше 250 строк. Если больше - разбей.

### Стили
- Глобальные CSS-переменные в `globals.css`
- Per-component стили - CSS Modules (`Hero.module.css`)
- Не используй inline стили кроме `style={{ '--bg': '...' }}` для CSS-переменных-параметров

### Аккессибилити
- Все интерактивные элементы - `<button>` (не `<div onClick>`)
- `aria-expanded` на аккордеонах
- `alt` обязателен для `<Image>` (на декоративных - `alt=""`)
- Контраст текста минимум 4.5:1

### Производительность
- Все секции-RSC по умолчанию. Клиентский компонент только если нужен state/event (Preloader, Accordion, Slider, LangToggle, FacebookPixel).
- Видео в Students/Portfolio: `<video autoPlay muted loop playsInline preload="metadata" />`
- `<Image>` для всех картинок (`width`, `height` обязательны)

### Без длинных тире
Клиент **не любит** "—". Везде в текстах писать обычный дефис "-". Это включает:
- Тексты в JSON-словарях
- Комментарии в коде (для консистентности)
- Документацию

## 10. Что уже сделано (по миграции)

- [x] VIP feat.4 = "Проверка домашних заданий Соней" (вместо "куратором")
- [x] Цены: 250€/490€/990€ (legacy)
- [x] Блок Gift добавлен (legacy)
- [x] Видео конвертированы MOV → MP4 H.264 (-94% размер)
- [x] Agents.md создан
- [ ] Next.js scaffold
- [ ] i18n setup (next-intl)
- [ ] FB Pixel scaffold
- [ ] Миграция компонентов (13 секций)
- [ ] GH Actions workflow
- [ ] Замена прода на Next.js-сборку

## 11. Контакты и контекст

- **Клиент:** Sofia Kantser (Молдова), курс по AI-контенту
- **Стартовая дата:** июнь 2026 ("Старт в июне")
- **Продюсер:** работает с разработчиком (агент) через техзадания
- **Платежи:** IuteCredit BNPL **временно убран** из тарифов (был активен с Site API key `84450032-...`, при необходимости откатить из git история)
- **Финальные ссылки CTA:** пока на `#pricing` (заглушка). Клиент позже даст Telegram/форму - тогда меняем 5+ кнопок одним правкой.

---

**Источник правды для контента:** `/index.html` (legacy). Все тексты, структура, стили - оттуда.
