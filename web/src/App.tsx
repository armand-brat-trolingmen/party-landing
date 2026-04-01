import { SiteHeader } from './components/layout/SiteHeader';
import { SectionHeading } from './components/ui/SectionHeading';
import { siteContent } from './data/siteContent';
import './styles/global.css';

const shellSections = [
  {
    id: 'services',
    title: 'Услуги',
    eyebrow: 'Что мы делаем',
    description: 'Скоро здесь появится обзор фудтраков, сладкой ваты, аниматоров и праздничных сценариев.',
  },
  {
    id: 'about',
    title: 'О нас',
    eyebrow: 'Кто мы',
    description: 'Подготовим короткий рассказ о команде, подходе к организации и атмосфере каждого события.',
  },
  {
    id: 'gallery',
    title: 'Галерея',
    eyebrow: 'Моменты праздника',
    description: 'Этот блок станет витриной фотографий и ярких деталей прошедших мероприятий.',
  },
  {
    id: 'reviews',
    title: 'Отзывы',
    eyebrow: 'Нам доверяют',
    description: 'Здесь будут собраны реальные впечатления гостей и заказчиков после проведенных праздников.',
  },
  {
    id: 'faq',
    title: 'Частые вопросы',
    eyebrow: 'Полезно знать',
    description: 'Добавим ответы про формат работы, бронирование, логистику и подготовку площадки.',
  },
  {
    id: 'contact',
    title: 'Контакты',
    eyebrow: 'Связаться с нами',
    description: 'В этом разделе появятся способы связи, чтобы быстро обсудить дату, формат и детали события.',
  },
] as const;

export default function App() {
  return (
    <>
      <SiteHeader />
      <main className="site-shell">
        <section
          id="hero"
          className="site-section site-section--hero"
          data-testid="section-hero"
          aria-label="Главный экран"
        >
          <div className="site-container">
            <article className="site-section__content">
              <div className="site-section__header">
                <p className="site-section__eyebrow">Атмосфера праздника</p>
                <h1>{siteContent.brand}</h1>
                <p className="site-section__description">{siteContent.tagline}</p>
                <p className="site-section__description">{siteContent.heroDescription}</p>
              </div>
            </article>
          </div>
        </section>
        {shellSections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            className="site-section"
            data-testid={`section-${section.id}`}
            aria-label={section.title}
          >
            <div className="site-container">
              <article className="site-section__content">
                <SectionHeading
                  eyebrow={section.eyebrow}
                  title={section.title}
                  description={section.description}
                />
              </article>
            </div>
          </section>
        ))}
      </main>
    </>
  );
}
