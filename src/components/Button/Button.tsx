import type { ComponentProps } from 'react'
import styles from './Button.module.css'

export type ButtonVariant = 'default' | 'primary' | 'ghost'

// ComponentProps<'button'> включает ref (в React 19 ref — обычный проп)
interface ButtonProps extends ComponentProps<'button'> {
  variant?: ButtonVariant
}

/** Общая кнопка. Дополнительные стили передаются через className. */
export function Button({ variant = 'default', className, type = 'button', ...rest }: ButtonProps) {
  const classes = [styles.button, variant !== 'default' && styles[variant], className]
    .filter(Boolean)
    .join(' ')

  return <button type={type} className={classes} {...rest} />
}
