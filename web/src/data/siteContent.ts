import { siteConfig } from '../content';
import { avitoProfileUrl } from '../content/contacts';
import { moments, services as catalogServices } from './catalogContent';

export { avitoProfileUrl };

export const navItems = siteConfig.navigation;
export const conceptLoopSeparator = siteConfig.homepage.conceptLoop.separator;
export const conceptLoopItems = siteConfig.homepage.conceptLoop.items;

export const siteContent = {
  brand: siteConfig.brand.name,
  tagline: siteConfig.homepage.hero.title,
  heroDescription: siteConfig.homepage.hero.description,
  heroSupportingNote: `${siteConfig.brand.serviceArea} • частные и корпоративные события`,
} as const;

export const heroPosterSlides = siteConfig.homepage.hero.slides;

export const aboutAtelierScene = {
  eyebrow: siteConfig.homepage.about.eyebrow,
  description: siteConfig.homepage.about.description,
  manifest: siteConfig.homepage.about.manifest,
} as const;

export const aboutAtelierLayers = siteConfig.homepage.about.layers;

export const aboutAccents = [
  {
    id: 'catalog-fit',
    title: 'Подбираем формат под сценарий, а не наоборот',
    text: 'Каждая услуга встраивается в событие как часть общей истории, а не как отдельная случайная активность.',
  },
  {
    id: 'guest-flow',
    title: 'Собираем удобный поток гостей',
    text: 'Думаем не только про картинку, но и про то, как люди подходят к зоне, взаимодействуют с ней и возвращаются снова.',
  },
  {
    id: 'calm-service',
    title: 'Держим подачу красивой и спокойной',
    text: 'Нам важно, чтобы формат оставался аккуратным весь вечер и не создавал для площадки лишнего напряжения.',
  },
] as const;

export const services = catalogServices;
export const momentFeedItems = moments;

export const momentFeedSectionCopy = {
  eyebrow: siteConfig.homepage.moments.eyebrow,
  description: siteConfig.homepage.moments.description,
} as const;

export const faqSectionCopy = {
  eyebrow: siteConfig.homepage.faq.eyebrow,
  description: siteConfig.homepage.faq.description,
} as const;

export const faqItems = siteConfig.homepage.faq.items;

export const contactGuidedCopy = {
  eyebrow: siteConfig.homepage.contact.title,
  description: siteConfig.homepage.contact.description,
  guideTitle: siteConfig.homepage.contact.guideTitle,
  guideDescription: siteConfig.homepage.contact.guideDescription,
  exampleMessage: siteConfig.homepage.contact.exampleMessage,
} as const;

export const contactPromptItems = siteConfig.homepage.contact.promptItems;
export const contactActionsGuided = siteConfig.homepage.contact.actions;
