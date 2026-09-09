interface LogoProps {
  size?: number;
  showText?: boolean;
  textSize?: number;
}

export default function Logo({ size = 28, showText = true, textSize }: LogoProps) {
  const ts = textSize ?? Math.round(size * 0.72);
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: size * 0.3, textDecoration: 'none' }}>
      <img
        src="/logo.png"
        alt="AZEINO"
        width={size}
        height={size}
        style={{
          objectFit: 'contain',
          display: 'block',
          filter: 'brightness(0) invert(1) sepia(1) saturate(4) hue-rotate(210deg)',
        }}
      />
      {showText && (
        <span style={{
          fontSize: ts,
          fontWeight: 700,
          background: 'linear-gradient(135deg, #818CF8 0%, #6366F1 50%, #22D3EE 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '-0.02em',
          lineHeight: 1,
        }}>
          AZEINO
        </span>
      )}
    </span>
  );
}
