import type { ReactNode } from 'react';
import { siteConfig, type OfferingEntity, type ServicePagePackage, type ServicePageTariff } from '../../content';
import { useOrderModal } from '../cta/useOrderModal';
import { ContactPlaceholderSection } from '../sections/ContactPlaceholderSection';
import { CtaSection } from '../sections/CtaSection';
import { ExtrasSection } from '../sections/ExtrasSection';
import { FaqSection } from '../sections/FaqSection';
import { ServiceMomentsGallery } from '../sections/ServiceMomentsGallery';
import { ServicesSection } from '../sections/ServicesSection';
import { TestimonialsSection } from '../sections/TestimonialsSection';
import { OfferingVisual } from '../ui/OfferingVisual';
import styles from './OfferingPageTemplate.module.css';

type OfferingPageTemplateProps = {
  offering: OfferingEntity;
  typeLabel?: string;
};

function CheckList({ items }: { items: readonly string[] }) {
  return (
    <ul className={styles.detailList}>
      {items.map((item) => (
        <li key={item} className={styles.detailItem}>
          <span className={styles.detailMark} aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function ResponsibilityList({ items }: { items: readonly string[] }) {
  return (
    <div className={styles.responsibilityList}>
      {items.map((item, index) => (
        <div key={item} className={styles.responsibilityItem}>
          <span className={styles.responsibilityNumber} aria-hidden="true">
            {String(index + 1).padStart(2, '0')}
          </span>
          <p>{item}</p>
        </div>
      ))}
    </div>
  );
}

function TariffCard({ tariff }: { tariff: ServicePageTariff }) {
  return (
    <article className={styles.tariffCard}>
      <div className={styles.tariffTopline}>
        <h3 className={styles.tariffTitle}>{tariff.title}</h3>
        {tariff.subtitle ? <span className={styles.tariffSubtitle}>{tariff.subtitle}</span> : null}
      </div>

      {tariff.price ? <p className={styles.tariffPrice}>{tariff.price}</p> : null}
      {tariff.weekdayPrice ? <p className={styles.tariffWeekday}>{tariff.weekdayPrice}</p> : null}

      {tariff.variants ? (
        <div className={styles.tariffVariants}>
          {tariff.variants.map((variant) => (
            <span key={variant.label} className={styles.tariffVariant}>
              <span>{variant.label}</span>
              <strong>{variant.price}</strong>
            </span>
          ))}
        </div>
      ) : null}

      {tariff.note ? <p className={styles.tariffNote}>{tariff.note}</p> : null}
    </article>
  );
}

function PackageCard({ servicePackage }: { servicePackage: ServicePagePackage }) {
  return (
    <article className={styles.packageCard}>
      <div className={styles.packageHeader}>
        <h3 className={styles.packageTitle}>{servicePackage.title}</h3>
        {servicePackage.meta ? <span className={styles.packageMeta}>{servicePackage.meta}</span> : null}
      </div>
      <CheckList items={servicePackage.items} />
      {servicePackage.additions?.length ? (
        <div className={styles.additions}>
          {servicePackage.additions.map((addition) => (
            <span key={addition} className={styles.addition}>
              {addition}
            </span>
          ))}
        </div>
      ) : null}
    </article>
  );
}

function DetailPanel({
  title,
  children,
  testId,
  variant = 'panel',
}: {
  title: string;
  children: ReactNode;
  testId?: string;
  variant?: 'panel' | 'plain';
}) {
  return (
    <section className={`${styles.detailPanel} ${variant === 'plain' ? styles.plainDetailPanel : ''}`} data-testid={testId}>
      <h2 className={styles.detailTitle}>{title}</h2>
      {children}
    </section>
  );
}

function getDeliveryContent(value: string) {
  const parts = value
    .split('—')
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length > 1) {
    return parts.slice(1).join(' — ');
  }

  return parts[0] ?? value;
}

function capitalizeFirstLetter(value: string) {
  if (!value) {
    return value;
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatDurationLabel(value: string) {
  const duration = value.trim();

  if (duration.startsWith('от ')) {
    return duration;
  }

  if (/час$/u.test(duration)) {
    return `от ${duration.replace(/час$/u, 'часа')}`;
  }

  if (/часа$/u.test(duration)) {
    return `от ${duration.replace(/часа$/u, 'часов')}`;
  }

  if (/минута$/u.test(duration)) {
    return `от ${duration.replace(/минута$/u, 'минуты')}`;
  }

  if (/минуты$/u.test(duration)) {
    return `от ${duration.replace(/минуты$/u, 'минут')}`;
  }

  return `от ${duration}`;
}

function LegacyOfferingPage({ offering, typeLabel }: OfferingPageTemplateProps) {
  const { openModal } = useOrderModal();

  return (
    <>
      <section className={`site-section ${styles.leadSection}`} data-testid="section-offering-intro" aria-labelledby="offering-title">
        <div className="site-container">
          <article className={`${styles.leadFrame} site-panel-glow`} data-testid="offering-extra-hero">
            <div className={styles.leadLayout}>
              <div className={styles.copyCard}>
                {typeLabel ? <span className={styles.eyebrow}>{typeLabel}</span> : null}
                <div className={styles.extraHeadlineBlock}>
                  <h1 id="offering-title" className={styles.title}>
                    {offering.name}
                  </h1>
                  <p className={styles.leadHighlight}>{offering.shortDescription}</p>
                </div>
                <p className={styles.description}>{offering.fullDescription}</p>

                <div className={styles.metaRow}>
                  <span className={styles.priceBadge} data-testid="offering-extra-price">
                    {offering.price?.display ?? offering.priceFrom}
                  </span>
                  <button type="button" className={styles.orderButton} onClick={openModal}>
                    Заказать
                  </button>
                </div>

                <div className={styles.includedBlock} data-testid="offering-extra-included">
                  <h2 className={styles.includedTitle}>Что входит в формат</h2>
                  <ul className={styles.includedList}>
                    {offering.included.map((item) => (
                      <li key={item} className={styles.includedItem}>
                        <span className={styles.includedDot} aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className={`${styles.visualCard} ${styles.extraVisualCard}`} data-testid="offering-extra-visual">
                {offering.kind === 'extra' ? (
                  offering.visual.image ? (
                    <picture className={styles.extraVisualPicture}>
                      {offering.visual.imageWebpSrcSet ? (
                        <source
                          data-testid="offering-extra-visual-source-webp"
                          type="image/webp"
                          srcSet={offering.visual.imageWebpSrcSet}
                          sizes={offering.visual.sizes}
                        />
                      ) : null}
                      <img
                        className={styles.extraVisualImage}
                        data-testid="offering-extra-visual-image"
                        src={offering.visual.image}
                        alt={offering.visual.alt ?? offering.name}
                        width={offering.visual.width}
                        height={offering.visual.height}
                        loading="eager"
                        decoding="async"
                        fetchPriority="high"
                      />
                    </picture>
                  ) : (
                    <div className={styles.extraVisualBlank} data-testid="offering-extra-visual-blank" aria-hidden="true" />
                  )
                ) : (
                  <OfferingVisual visual={offering.visual} label={offering.name} />
                )}
              </div>
            </div>
          </article>
        </div>
      </section>

      <ServicesSection allowReveal={false} items={siteConfig.services} />
      <ExtrasSection />
      <TestimonialsSection />
      <FaqSection />
      <ContactPlaceholderSection />
      <CtaSection
        sectionTestId="section-offering-cta"
        title={`Нужна услуга «${offering.name}» на ваше событие?`}
        description="Оставьте имя и телефон — заказчик свяжется с вами, поможет уточнить детали и подскажет следующий шаг."
      />
    </>
  );
}

export function OfferingPageTemplate({ offering, typeLabel }: OfferingPageTemplateProps) {
  const { openModal } = useOrderModal();
  const servicePage = offering.servicePage;

  if (!servicePage) {
    return <LegacyOfferingPage offering={offering} typeLabel={typeLabel} />;
  }

  const otherServices = siteConfig.services.filter((service) => service.slug !== offering.slug);
  const heroPrice = offering.price?.display ?? offering.priceFrom;
  const deliveryMoscowAccent = getDeliveryContent(servicePage.delivery.moscow);
  const deliveryRegionAccent = capitalizeFirstLetter(getDeliveryContent(servicePage.delivery.region));

  return (
    <>
      <section className={`site-section ${styles.servicePageSection}`} data-testid="section-offering-intro" aria-labelledby="offering-title">
        <div className="site-container">
          <article className={`${styles.serviceHero} site-panel-glow`} data-testid="offering-hero">
            <div className={styles.serviceHeroCopy}>
              {servicePage.comboBadge ? (
                <div className={styles.serviceHeroMeta}>
                  <span className={styles.comboBadge} data-testid="offering-combo-badge">
                    <strong>{servicePage.comboBadge.label}</strong>
                    <span>{servicePage.comboBadge.text}</span>
                  </span>
                </div>
              ) : null}

              <h1 id="offering-title" className={styles.serviceTitle}>
                {offering.name}
              </h1>
              <p className={styles.serviceDescription}>{offering.shortDescription}</p>

              <div className={styles.serviceHeroActions}>
                <button type="button" className={styles.orderButton} onClick={openModal}>
                  Заказать
                </button>
              </div>

              {heroPrice ? (
                <div className={styles.quickFacts}>
                  <div className={`${styles.quickFact} ${styles.priceQuickFact}`} data-testid="offering-price">
                    <span>Цена</span>
                    <strong>{heroPrice}</strong>
                  </div>
                  {servicePage.duration ? (
                    <div className={styles.quickFact} data-testid="offering-duration">
                      <span>Длительность</span>
                      <strong>{formatDurationLabel(servicePage.duration)}</strong>
                    </div>
                  ) : null}
                </div>
              ) : null}

              {servicePage.notes?.length ? (
                <div className={styles.serviceNotes}>
                  {servicePage.notes.map((note) => (
                    <span key={note} className={styles.serviceNote} data-testid="offering-special-note">
                      {note}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>

            {offering.homeCardImage ? (
              <picture
                className={styles.serviceHeroVisual}
                data-image-fit={offering.homeCardImage.objectFit}
                data-service-slug={offering.slug}
              >
                <source
                  type={offering.homeCardImage.sourceType ?? 'image/webp'}
                  srcSet={offering.homeCardImage.src}
                  sizes={offering.homeCardImage.sizes}
                />
                <img
                  className={styles.serviceHeroImage}
                  data-image-fit={offering.homeCardImage.objectFit}
                  data-service-slug={offering.slug}
                  data-testid="offering-hero-image"
                  src={offering.homeCardImage.fallbackSrc}
                  alt={offering.name}
                  width={offering.homeCardImage.width}
                  height={offering.homeCardImage.height}
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  sizes={offering.homeCardImage.sizes}
                  style={{ objectFit: offering.homeCardImage.objectFit, objectPosition: offering.homeCardImage.objectPosition }}
                />
              </picture>
            ) : (
              <div className={styles.serviceHeroVisual} data-testid="offering-hero-placeholder" aria-label={`Будущее фото услуги ${offering.name}`} />
            )}
          </article>

          <ServiceMomentsGallery />

          <div className={styles.detailGrid}>
            <DetailPanel title="В стоимость включено" testId="offering-included">
              <CheckList items={servicePage.included} />
            </DetailPanel>
            <DetailPanel title="Что мы берем на себя" testId="offering-materials">
              <ResponsibilityList items={servicePage.materials} />
            </DetailPanel>
          </div>

          <section className={styles.tariffsSection} data-testid="offering-tariffs" aria-labelledby="offering-tariffs-title">
            <div className={styles.blockHeading}>
              <h2 id="offering-tariffs-title">Тарифы</h2>
              <p>Формат можно адаптировать под площадку, поток гостей и длительность события.</p>
            </div>
            <div className={styles.tariffsGrid}>
              {servicePage.tariffs.map((tariffItem) => (
                <TariffCard key={`${tariffItem.title}-${tariffItem.price ?? tariffItem.variants?.map((variant) => variant.price).join('-')}`} tariff={tariffItem} />
              ))}
            </div>
          </section>

          {servicePage.packages?.length ? (
            <section className={styles.packageSection} aria-label="Состав пакетов">
              <div className={styles.packageGrid} data-package-count={servicePage.packages.length}>
                {servicePage.packages.map((servicePackage) => (
                  <PackageCard key={servicePackage.title} servicePackage={servicePackage} />
                ))}
              </div>
            </section>
          ) : null}

          <DetailPanel title="Доставка" testId="offering-delivery" variant="plain">
            <div className={styles.deliveryRows} data-testid="offering-delivery-box">
              <article className={styles.deliverySegment} data-testid="offering-delivery-moscow">
                <strong className={styles.deliveryLabel}>Москва</strong>
                <p className={styles.deliveryValue}>{deliveryMoscowAccent}</p>
              </article>
              <article className={styles.deliverySegment} data-testid="offering-delivery-region">
                <strong className={styles.deliveryLabel}>Московская область</strong>
                <p className={`${styles.deliveryValue} ${styles.deliveryRegionText}`}>{deliveryRegionAccent}</p>
              </article>
            </div>
          </DetailPanel>
        </div>
      </section>

      <div data-testid="section-offering-other-services">
        <ServicesSection
          allowReveal={false}
          items={otherServices}
          sectionId="services"
          title="Другие услуги"
          description="Можно добавить к заказу еще один формат и собрать более плотную праздничную зону."
          revealOnScroll={false}
          priorityImageCount={0}
        />
      </div>
      <ExtrasSection />
      <TestimonialsSection />
      <FaqSection />
      <ContactPlaceholderSection />
      <CtaSection
        sectionTestId="section-offering-cta"
        title={`Нужна услуга «${offering.name}» на ваше событие?`}
        description="Оставьте имя и телефон — заказчик свяжется с вами, поможет уточнить детали и подскажет следующий шаг."
      />
    </>
  );
}
