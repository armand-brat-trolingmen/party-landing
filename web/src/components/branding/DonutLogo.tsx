type DonutLogoProps = {
  size?: number;
  className?: string;
};

export function DonutLogo({ size = 30, className }: DonutLogoProps) {
  return (
    <img
      aria-hidden="true"
      className={className}
      data-testid="donut-logo"
      src="/brand-logo.png"
      alt=""
      width={size}
      height={size}
      decoding="async"
    />
  );
}
