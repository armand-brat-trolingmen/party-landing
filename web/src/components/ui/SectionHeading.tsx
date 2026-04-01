import type { ReactNode } from 'react';

type SectionHeadingProps = {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
};

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <header className="site-section__header">
      {eyebrow ? <p className="site-section__eyebrow">{eyebrow}</p> : null}
      <h2>{title}</h2>
      {description ? <p className="site-section__description">{description}</p> : null}
    </header>
  );
}
