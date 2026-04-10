import { brand } from './brand';
import { contacts } from './contacts';
import { legal } from './legal';
import { navigation } from './navigation';

export const siteConfig = {
  brand,
  contacts,
  navigation,
  homepage: {},
  services: [],
  extras: [],
  testimonials: [],
  faq: [],
  legal,
  seo: {},
} as const;

export { brand } from './brand';
export { contacts } from './contacts';
export { legal } from './legal';
export { navigation } from './navigation';
