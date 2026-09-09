'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const styles: Record<string, React.CSSProperties> = {
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontWeight: 500,
    borderRadius: 'var(--radius-md)',
    border: 'none',
    transition: 'all 0.15s ease',
    cursor: 'pointer',
    fontFamily: 'var(--font)',
  },
  primary: { background: 'var(--color-primary)', color: '#fff' },
  secondary: { background: 'var(--color-surface-2)', color: 'var(--color-text)', border: '1px solid var(--color-border)' },
  ghost: { background: 'transparent', color: 'var(--color-text-muted)' },
  danger: { background: 'var(--color-error)', color: '#fff' },
  sm: { padding: '6px 12px', fontSize: '13px' },
  md: { padding: '10px 18px', fontSize: '14px' },
  lg: { padding: '13px 24px', fontSize: '15px' },
};

export default function Button({ variant = 'primary', size = 'md', loading, children, style, ...props }: ButtonProps) {
  return (
    <button
      style={{ ...styles.base, ...styles[variant], ...styles[size], opacity: props.disabled || loading ? 0.6 : 1, ...style }}
      disabled={props.disabled || loading}
      {...props}
    >
      {loading ? <span style={{ width: 14, height: 14, border: '2px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.6s linear infinite' }} /> : null}
      {children}
    </button>
  );
}
