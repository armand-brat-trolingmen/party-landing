# Content Hub Centralization Design

## Goal

Собрать весь пользовательский и служебный контент сайта в единый централизованный источник данных, чтобы компоненты больше не читали строки и конфиг из разрозненных файлов и не создавали рассинхрон по контактам, SEO, названиям, описаниям и юридическим данным.

## Problem Summary

Сейчас проект уже частично централизован, но данные распределены между несколькими файлами:

- `web/src/data/siteContent.ts`
- `web/src/data/catalogContent.ts`
- `web/src/data/footerContent.ts`

Из-за этого возникают симптомы:

- контакты форматируются по-разному в разных местах
- служебные и legal-данные живут отдельно от brand/contact-данных
- SEO-строки и UI-копирайт частично собираются локально рядом с компонентами
- есть риск повторного появления placeholder-значений и текстового рассинхрона

## Desired Outcome

После рефактора у сайта должен появиться единый публичный объект конфигурации:

```ts
const siteConfig = {
  brand: {...},
  contacts: {...},
  navigation: [...],
  homepage: {...},
  services: [...],
  extras: [...],
  testimonials: [...],
  faq: [...],
  legal: {...},
  seo: {...},
}
```

Компоненты, страницы и SEO-слой должны читать данные только из этого централизованного content hub, а не из случайных локальных констант.

## Recommended Architecture

Вместо одного гигантского файла используется `content hub` с единым входом и модульной внутренней структурой.

### Public Entry

- `web/src/content/index.ts`

Этот файл экспортирует:

- `siteConfig`
- при необходимости тонкие селекторы/хелперы вроде `getServiceBySlug`, `getOfferingPath`, `getLegalDocumentByPath`

### Internal Modules

- `web/src/content/brand.ts`
- `web/src/content/contacts.ts`
- `web/src/content/navigation.ts`
- `web/src/content/homepage.ts`
- `web/src/content/offerings.ts`
- `web/src/content/testimonials.ts`
- `web/src/content/faq.ts`
- `web/src/content/legal.ts`
- `web/src/content/seo.ts`
- `web/src/content/formatters.ts`
- `web/src/content/types.ts`

### Structure Intent

- `brand.ts` — название бренда, краткие подписи, география, универсальные текстовые константы
- `contacts.ts` — raw и display-форматы телефона, email, messengers, внешние ссылки
- `navigation.ts` — пункты меню и служебные section ids
- `homepage.ts` — hero, about, concept loop, contact, CTA и homepage-specific copy
- `offerings.ts` — услуги, доп. услуги, карточки, цены, изображения, slug, CTA, lookup helpers
- `testimonials.ts` — отзывы и social proof
- `faq.ts` — FAQ-данные
- `legal.ts` — реквизиты, legal links, документы, footer legal copy
- `seo.ts` — дефолтные SEO-данные, маршрутные правила и сборщики title/description/canonical
- `formatters.ts` — единые форматтеры телефона, цен, mailto/tel, label-представлений
- `types.ts` — общие content-типы без циклических импортов

## Public Data Contract

Снаружи проект должен работать через один агрегированный объект:

```ts
export const siteConfig = {
  brand,
  contacts,
  navigation,
  homepage,
  services,
  extras,
  testimonials,
  faq,
  legal,
  seo,
} as const;
```

### Required Guarantees

- `siteConfig.contacts` содержит и raw, и display-форматы
- `siteConfig.services` и `siteConfig.extras` содержат все данные, нужные и для homepage, и для detail-страниц
- `siteConfig.legal` является единственным источником контактов для footer/legal-страниц
- `siteConfig.seo` не дублирует brand/contact-строки вручную, а собирает их из общих источников

## Formatting Rules

Чтобы убрать текстовую неравномерность, форматирование должно быть централизовано, а не размазано по JSX.

### Contacts

`contacts.ts` должен хранить:

- `phone.raw`
- `phone.href`
- `phone.display`
- `email.raw`
- `email.href`
- `email.display`
- messenger links

Такой подход позволит:

- показывать красивый формат на UI
- использовать единый `tel:`/`mailto:`
- исключить ручную склейку строки в компонентах

### Prices

Цена должна храниться в одном нормализованном виде на уровне offerings, а UI брать уже готовое display-значение либо получать его через общий formatter.

Рекомендуемая схема:

- `price.from` — исходное числовое или нормализованное значение
- `price.display` — готовое `от 15.000 ₽`

Это уберёт дубли вида “добавить ₽ в карточке”, “не добавить ₽ на detail-странице”, “разный разделитель тысяч”.

### Text Blocks

Большие текстовые фрагменты не должны собираться вручную в JSX из половинок строк. Если секция имеет заголовок, описание, подпись, CTA и helper-copy, всё это живёт рядом в content hub как законченный контентный блок.

## Migration Strategy

Рефактор должен пройти без визуальной переработки сайта.

### Phase 1: Introduce the content hub

- добавить `src/content/*`
- собрать `siteConfig`
- завести общие типы и форматтеры

### Phase 2: Bridge old imports

- перевести страницы и компоненты на чтение из `src/content`
- при необходимости оставить временные адаптеры в старых `data/*` файлах, чтобы не ломать всё одномоментно

### Phase 3: Remove duplication

- убрать старые дублирующиеся константы
- удалить локальные текстовые строки, если они уже есть в content hub
- перевести SEO helper-логику на общий источник

### Phase 4: Tighten guarantees

- добавить тесты целостности `siteConfig`
- добавить регрессионные тесты на контакты, legal, homepage copy и critical SEO

## Files Expected To Change

### Create

- `web/src/content/index.ts`
- `web/src/content/types.ts`
- `web/src/content/brand.ts`
- `web/src/content/contacts.ts`
- `web/src/content/navigation.ts`
- `web/src/content/homepage.ts`
- `web/src/content/offerings.ts`
- `web/src/content/testimonials.ts`
- `web/src/content/faq.ts`
- `web/src/content/legal.ts`
- `web/src/content/seo.ts`
- `web/src/content/formatters.ts`

### Migrate / Simplify

- `web/src/data/siteContent.ts`
- `web/src/data/catalogContent.ts`
- `web/src/data/footerContent.ts`
- `web/src/config/seo.ts`
- `web/src/components/**/*`
- `web/src/pages/**/*`

## Testing Strategy

### Content integrity

- test that `siteConfig` contains all required top-level keys
- test that critical contacts come from one source
- test that legal pages and footer render the same phone/email values
- test that no placeholder contact values remain in content sources

### UI integration

- homepage sections still render the same headings and CTA copy
- service cards and detail pages still resolve by slug
- footer, contact section and legal pages stay synchronized

### SEO integration

- service and extra SEO titles/descriptions are generated from the centralized config
- legal pages read SEO content from the same hub
- canonical paths remain correct

## Non-Goals

Этот этап не включает:

- визуальный редизайн сайта
- замену текущей IA или URL-структуры
- CMS/админку
- внешнюю базу данных или headless CMS

## Acceptance Criteria

Работа считается успешной, когда:

- весь пользовательский и служебный контент сайта читается из `siteConfig` или его официальных модулей
- контакты, реквизиты, legal links и brand-данные имеют один источник правды
- SEO-генерация использует централизованные данные
- ручные строковые склейки в компонентах заметно сокращены или исчезают
- старые placeholder-данные и дубли удалены
- текущий UI и маршруты не меняются визуально без отдельной задачи

## Recommendation

Реализовать этот рефактор как контентную централизацию без дизайновых изменений, а после него уже переходить к следующему этапу: наполнению и полировке detail-страниц услуг. Это даст устойчивую базу для дальнейших правок и резко снизит риск нового рассинхрона по контенту.
