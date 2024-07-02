import { useMergeRefs } from '@floating-ui/react'
import type { HTMLProps} from 'react';
import { cloneElement, forwardRef, isValidElement } from 'react'
import { useTooltipContext } from './hooks/useTooltipContext'

export const TooltipTrigger = forwardRef<HTMLElement, HTMLProps<HTMLElement> & { asChild?: boolean; alignMiddle?: boolean }>(
  ({ children, asChild = false, alignMiddle = false, ...props }, propRef) => {
    const context = useTooltipContext()
    const ref = useMergeRefs([context.refs.setReference, propRef])

    // `asChild` allows the user to pass any element as the anchor
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
      <div
        className={`inline-block ${alignMiddle ? 'align-middle' : ''}`}
        ref={ref}
        data-state={context.open ? 'open' : 'closed'}
        {...context.getReferenceProps(props)}
      >
        {children}
      </div>
    )
  }
)

TooltipTrigger.displayName = 'TooltipTrigger'
