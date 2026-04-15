type DonutLogoProps = {
  size?: number;
  className?: string;
};

export function DonutLogo({ size = 30, className }: DonutLogoProps) {
  return (
    <picture aria-hidden="true">
      <source
        type="image/webp"
        srcSet="/brand-logo-ui.webp 384w, /brand-logo.webp 1536w"
        sizes={`${size}px`}
      />
      <img
        className={className}
        data-testid="donut-logo"
        src="/brand-logo-ui.png"
        srcSet="/brand-logo-ui.png 384w, /brand-logo.png 1536w"
        sizes={`${size}px`}
        alt=""
        width={size}
        height={size}
        decoding="async"
        fetchPriority="high"
      />
    </picture>
  );
}
