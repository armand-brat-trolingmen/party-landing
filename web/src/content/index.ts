import { brand } from './brand';
import { contacts } from './contacts';
import { homepage } from './homepage';
import { legal } from './legal';
import { navigation } from './navigation';
import { notFound } from './notFound';
import { extras, reviewProofs, services } from './offerings';
import { seo } from './seo';
import { articles } from './articles';

export const siteConfig = {
  brand,
  contacts,
  navigation,
  homepage,
  services,
  extras,
  articles,
  testimonials: reviewProofs,
  faq: homepage.faq.items,
  legal,
  notFound,
  seo,
} as const;

export { brand } from './brand';
export { contacts } from './contacts';
export { homepage } from './homepage';
export { legal } from './legal';
export { navigation } from './navigation';
export { notFound } from './notFound';
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
export type {
  CatalogVisual,
  HomeCardImage,
  MomentEntity,
  OfferingEntity,
  ReviewProofEntity,
  ServicePagePackage,
  ServicePageTariff,
} from './offerings';
export { avitoProfileUrl } from './contacts';
export {
  articleImages,
  articles,
  findArticleBySlug,
  getAllArticleUrls,
  getArticlePath,
  getArticleTextContent,
} from './articles';
export type {
  ArticleEntity,
  ArticleFaqItem,
  ArticleIconId,
  ArticleImage,
  ArticleSection,
  ArticleTextBlock,
} from './articles';
export { buildHomeServiceDescription, getOfferingSeoDescription, seo } from './seo';
