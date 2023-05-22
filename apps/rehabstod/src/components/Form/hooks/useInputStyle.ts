import { classNames } from '../../../utils/classNames'

const getStyle = ({ error, disabled, bright }: Record<string, boolean | undefined>): string => {
  if (disabled) {
    return 'bg-white border-neutral-40'
  }

  if (error) {
    return 'bg-error-99 border-error-40'
  }

  if (bright) {
    return 'bg-white border-accent-40'
  }

  return 'bg-secondary-95 border-accent-40'
}

export function useInputStyle(props: Record<string, boolean | undefined>): string {
  return classNames('text-neutral-20 my-3 box-border flex w-full rounded border text-left overflow-hidden text-ellipsis', getStyle(props))
}
