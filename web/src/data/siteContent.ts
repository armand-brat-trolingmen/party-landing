import { homePageContent, moments, services as catalogServices } from './catalogContent';

export const avitoProfileUrl = 'https://www.avito.ru/brands/i82014135/all';

export const navItems = [
  { id: 'about', label: 'О нас' },
  { id: 'services', label: 'Услуги' },
  { id: 'extras', label: 'Доп. услуги' },
  { id: 'testimonials', label: 'Отзывы' },
  { id: 'faq', label: 'FAQ' },
  { id: 'contact', label: 'Контакты' },
] as const;

export const siteContent = {
  brand: 'Праздник каждый день',
  tagline: homePageContent.hero.title,
  heroDescription: homePageContent.hero.description,
} as const;

export const heroSceneItems = catalogServices.slice(0, 3).map((service) => ({
  id: service.slug,
  label: service.name,
  image: service.visual.image ?? '/brand-logo.png',
  width: service.visual.width ?? 220,
  height: service.visual.height ?? 260,
})) as readonly {
  id: string;
  label: string;
  image: string;
  width: number;
  height: number;
}[];

export const aboutAtelierScene = {
  eyebrow: homePageContent.about.eyebrow,
  description: homePageContent.about.description,
  manifest: homePageContent.about.manifest,
} as const;

export const aboutAtelierLayers = homePageContent.about.layers;

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
  eyebrow: homePageContent.moments.eyebrow,
  description: homePageContent.moments.description,
} as const;

export const faqSectionCopy = {
  eyebrow: 'Часто спрашивают',
  description:
    'Собрали ответы на частые вопросы, чтобы вам было проще понять, как мы работаем и что потребуется от площадки.',
} as const;

export const faqItems = [
  {
    id: 'events',
    question: 'Для каких мероприятий подходят ваши форматы?',
    answer:
      'Наши сладкие станции и гастроформаты подходят для частных праздников, детских дней рождения, корпоративных встреч, офисных событий и городских мероприятий, где важны вкус, подача и атмосфера.',
  },
  {
    id: 'formats',
    question: 'Можно ли выбрать сразу несколько услуг на одно мероприятие?',
    answer:
      'Да. Мы как раз собираем сайт как каталог, чтобы было удобно комбинировать основные и дополнительные услуги под один сценарий события.',
  },
  {
    id: 'venue',
    question: 'Что обычно требуется от площадки?',
    answer:
      'Требования зависят от выбранной услуги, но чаще всего заранее уточняются электричество, вода, место под установку и логистика доступа. Все детали спокойно сверяем до дня мероприятия.',
  },
  {
    id: 'moscow',
    question: 'Работаете ли вы по Москве и области?',
    answer:
      'Да. Основной радиус работы — Москва и Московская область. Если нужен другой формат выезда, это можно обсудить отдельно.',
  },
  {
    id: 'cta',
    question: 'Как оставить заявку быстрее всего?',
    answer:
      'Самый быстрый вариант — нажать кнопку «Заказать», оставить имя и телефон, а дальше заказчик уже свяжется с вами и поможет с подбором услуги.',
  },
  {
    id: 'extras',
    question: 'Зачем нужны дополнительные услуги?',
    answer:
      'Дополнительные услуги помогают точнее встроить основной формат в площадку, усилить подачу и сделать общий сценарий мероприятия более цельным.',
  },
] as const;

export const contactGuidedCopy = {
  eyebrow: 'Контакты',
  description:
    'Напишите или оставьте заявку удобным способом — поможем быстро сориентироваться по формату и следующему шагу.',
  guideTitle: 'Что удобно написать сразу',
  guideDescription:
    'Так мы быстрее поймём задачу и сможем сразу предложить подходящий вариант, не растягивая диалог на лишние уточнения.',
  exampleMessage:
    'Добрый день! Планируем событие в Москве, ориентир — 60 гостей. Интересны сладкая зона и дополнительная подача. Подскажите, какие форматы лучше подойдут под нашу площадку?',
} as const;

export const contactPromptItems = [
  'Дата и ориентир по времени',
  'Формат события и площадка',
  'Количество гостей и желаемые зоны',
] as const;

export const contactActionsGuided = [
  {
    id: 'telegram',
    label: 'Telegram',
    href: 'https://t.me/+79263919225',
    caption: 'Быстрый канал для первого диалога, референсов и уточнений по проекту.',
    icon: 'telegram',
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    href: 'https://wa.me/79263919225',
    caption: 'Удобно, если хочется обсудить формат короткими сообщениями в течение дня.',
    icon: 'whatsapp',
  },
  {
    id: 'avito',
    label: 'Avito',
    href: avitoProfileUrl,
    caption: 'Профиль и живые отзывы, которые помогают быстро проверить наш опыт.',
    icon: 'avito',
  },
] as const;
