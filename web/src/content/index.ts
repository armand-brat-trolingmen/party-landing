import { brand } from './brand';
import { contacts } from './contacts';
import { homepage } from './homepage';
import { legal } from './legal';
import { navigation } from './navigation';
import { extras, reviewProofs, services } from './offerings';

export const siteConfig = {
  brand,
  contacts,
  navigation,
  homepage,
  services,
  extras,
  testimonials: reviewProofs,
  faq: homepage.faq.items,
  legal,
  seo: {},
} as const;

export { brand } from './brand';
export { contacts } from './contacts';
export { homepage } from './homepage';
export { legal } from './legal';
export { navigation } from './navigation';
export {
  extras,
  findExtraBySlug,
  findServiceBySlug,
  getAllOfferingUrls,
  getOfferingPath,
  homePageContent,
  moments,
  reviewProofs,
  services,
} from './offerings';
export type { CatalogVisual, HomeCardImage, MomentEntity, OfferingEntity, ReviewProofEntity } from './offerings';
export { avitoProfileUrl } from './contacts';
