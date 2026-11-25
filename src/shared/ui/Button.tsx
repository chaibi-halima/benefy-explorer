import clsx from 'clsx';
import type { ButtonHTMLAttributes } from 'react';
import styles from './Button.module.scss';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  loading?: boolean;
  fullWidth?: boolean;
}

export function Button({ variant = 'primary', loading, fullWidth, disabled, className, children, ...rest }: ButtonProps) {
  return (
    <button
      className={clsx(styles.button, styles[variant], fullWidth && styles.full, className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? <span className={styles.spinner} aria-hidden="true" /> : null}
      {children}
    </button>
  );
}
