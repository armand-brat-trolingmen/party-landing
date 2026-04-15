export type TestimonialScreenshot = {
  id: string;
  src: string;
  webpSrc: string;
  alt: string;
  width: number;
  height: number;
  tone: 'rose' | 'sky' | 'gold';
};

export const testimonialScreenshots: readonly TestimonialScreenshot[] = [
  {
    id: 'review-1',
    src: '/images/reviews-proof/review-1.png',
    webpSrc: '/images/reviews-proof/review-1.webp',
    alt: 'Скриншот отзыва клиента на Avito, отзыв 1',
    width: 504,
    height: 382,
    tone: 'rose',
  },
  {
    id: 'review-2',
    src: '/images/reviews-proof/review-2.png',
    webpSrc: '/images/reviews-proof/review-2.webp',
    alt: 'Скриншот отзыва клиента на Avito, отзыв 2',
    width: 503,
    height: 197,
    tone: 'sky',
  },
  {
    id: 'review-3',
    src: '/images/reviews-proof/review-3.png',
    webpSrc: '/images/reviews-proof/review-3.webp',
    alt: 'Скриншот отзыва клиента на Avito, отзыв 3',
    width: 505,
    height: 307,
    tone: 'gold',
  },
  {
    id: 'review-4',
    src: '/images/reviews-proof/review-4.png',
    webpSrc: '/images/reviews-proof/review-4.webp',
    alt: 'Скриншот отзыва клиента на Avito, отзыв 4',
    width: 505,
    height: 252,
    tone: 'sky',
  },
  {
    id: 'review-5',
    src: '/images/reviews-proof/review-5.png',
    webpSrc: '/images/reviews-proof/review-5.webp',
    alt: 'Скриншот отзыва клиента на Avito, отзыв 5',
    width: 506,
    height: 220,
    tone: 'rose',
  },
  {
    id: 'review-6',
    src: '/images/reviews-proof/review-6.png',
    webpSrc: '/images/reviews-proof/review-6.webp',
    alt: 'Скриншот отзыва клиента на Avito, отзыв 6',
    width: 506,
    height: 288,
    tone: 'gold',
  },
] as const;
