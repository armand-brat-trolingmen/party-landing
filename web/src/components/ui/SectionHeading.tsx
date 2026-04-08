import type { ReactNode } from 'react';

type SectionHeadingProps = {
  title: ReactNode;
  description?: ReactNode;
  align?: 'start' | 'center';
};

export function SectionHeading({ title, description, align = 'start' }: SectionHeadingProps) {
  return (
    <header className="site-section__header" data-heading-align={align}>
      <h2>{title}</h2>
      {description ? <p className="site-section__description">{description}</p> : null}
    </header>
  );
}
