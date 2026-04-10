import { brand } from './brand';
import { contacts } from './contacts';
import { homepage } from './homepage';
import { legal } from './legal';
import { navigation } from './navigation';

export const siteConfig = {
  brand,
  contacts,
  navigation,
  homepage,
  services: [],
  extras: [],
  testimonials: [],
  faq: homepage.faq.items,
  legal,
  seo: {},
} as const;

export { brand } from './brand';
export { contacts } from './contacts';
export { homepage } from './homepage';
export { legal } from './legal';
export { navigation } from './navigation';
