import { classNames } from '../../utils/classNames'

const getStyle = ({ error, disabled, bright }: Record<string, boolean | undefined>): string => {
  if (disabled) {
    return 'bg-white border-neutral-40 border-0 py-px bg-form-disabled_background'
  }

  if (error) {
    return 'bg-error-99 border-error-40 border-0 py-px bg-form-invalid_background'
  }

  if (bright) {
    return 'bg-white border-accent-40'
  }
  return `bg-secondary-95 border-accent-40`
}

export function useInputStyle(props: Record<string, boolean | undefined>): string {
  return classNames('text-neutral-20 my-3 box-border w-full rounded border text-left truncate', getStyle(props))
}
