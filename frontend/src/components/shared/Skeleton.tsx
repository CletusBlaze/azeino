export function Skeleton({ width = '100%', height = 16, radius = 6, style = {} }: { width?: string | number; height?: number; radius?: number; style?: React.CSSProperties }) {
  return (
    <div style={{ width, height, borderRadius: radius, background: 'var(--color-surface-2)', animation: 'shimmer 1.5s infinite', ...style }} />
  );
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} width={i === lines - 1 ? '60%' : '100%'} height={14} />
      ))}
    </div>
  );
}

export function SkeletonMessage({ isUser = false }: { isUser?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', padding: '0 16px', marginBottom: 16 }}>
      <div style={{ maxWidth: '60%', display: 'flex', flexDirection: 'column', gap: 6, alignItems: isUser ? 'flex-end' : 'flex-start' }}>
        <Skeleton width={30} height={10} />
        <div style={{ padding: '12px 16px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px', display: 'flex', flexDirection: 'column', gap: 6, minWidth: 160 }}>
          <SkeletonText lines={2} />
        </div>
      </div>
    </div>
  );
}
