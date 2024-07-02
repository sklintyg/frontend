import { useMergeRefs } from '@floating-ui/react'
import type { HTMLProps } from 'react'
import { cloneElement, forwardRef, isValidElement } from 'react'
import { usePopoverContext } from './Popover'

export const PopoverTrigger = forwardRef<HTMLElement, HTMLProps<HTMLElement> & { asChild?: boolean }>(
  ({ children, asChild = false, ...props }, propRef) => {
    const context = usePopoverContext()
    const ref = useMergeRefs([context.refs.setReference, propRef])

    if (asChild && isValidElement(children)) {
      return cloneElement(
        children,
        context.getReferenceProps({
          ref,
          ...props,
          ...children.props,
          'data-state': context.open ? 'open' : 'closed',
        })
      )
    }

    return (
      <button
        type="button"
        ref={ref}
        data-state={context.open ? 'open' : 'closed'}
        onClick={() => context.setOpen(!context.open)}
        {...context.getReferenceProps(props)}
      >
        {children}
      </button>
    )
  }
)

PopoverTrigger.displayName = 'PopoverTrigger'
