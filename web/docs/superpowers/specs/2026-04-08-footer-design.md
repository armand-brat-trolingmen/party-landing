# Footer Design Spec

## Goal

Add a compact, status-oriented footer to the landing page without competing with the existing Contacts section. The footer should strengthen trust, surface legal data, and prepare the site for future CTA-based lead capture with separate legal pages.

## Visual Direction

- Tone: dark chocolate, not graphite-black
- Mood: minimalist, premium, calm
- Contrast: warm light text on a deep cocoa background
- Motion: only subtle hover feedback on links and social icons
- No oversized heading
- No duplicated site-section navigation list

## Footer Structure

### Row 1

- Logo
- `Праздник каждый день`
- Social links:
  - Telegram
  - WhatsApp
  - Avito
- Phone: `+79263919225`
- Email: `Glad_2015@bk.ru`

### Row 2

- `ИП Гладышев Александр Андреевич`
- `ИНН 501806886358`
- `ОГРНИП 319508100076437`
- `Юр. адрес: М.о., г.о. Королев, пр-д Матроросова, д. 3 А, кв. 28.`

### Legal Links

Text links only, routed to dedicated pages:

- `/privacy` — Политика конфиденциальности
- `/terms` — Пользовательское соглашение
- `/consent` — Согласие на обработку персональных данных

## UX Rules

- The Contacts section remains the main CTA area.
- The footer acts as a legal/trust ending, not a second contact section.
- Links should look like clean text links, not pill buttons.
- Social icons should stay visually light and compact.
- The legal links should remain visible on both desktop and mobile.

## Responsive Behavior

### Desktop

- Compact two-row composition
- Balanced horizontal rhythm
- No large empty columns

### Mobile

- Single-column stack
- Order:
  1. Logo + brand
  2. Social icons
  3. Phone + email
  4. Legal/business info
  5. Legal page links

## Implementation Notes

- Create a dedicated `Footer` component and add it after the current Contacts section.
- Store footer content in project data/config so legal and contact details are easy to update.
- Add the three legal routes as real pages, not anchor sections.
- Keep the palette connected to the current dessert brand language by using chocolate, milk, and soft caramel accents.

## Out of Scope

- Full footer navigation duplication from the header
- Large promo copy
- A second CTA block
- Full legal page copywriting
