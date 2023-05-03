/* eslint-disable react/jsx-props-no-spreading */
import { useMergeRefs } from '@floating-ui/react'
import React from 'react'
import { useTooltipContext } from './hooks/useTooltipContext'

export const TooltipTrigger = React.forwardRef<HTMLElement, React.HTMLProps<HTMLElement> & { asChild?: boolean }>(
  ({ children, asChild = false, ...props }, propRef) => {
    const context = useTooltipContext()
    const ref = useMergeRefs([context.refs.setReference, propRef])

    // `asChild` allows the user to pass any element as the anchor
    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(
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
      <div className="inline-block" ref={ref} data-state={context.open ? 'open' : 'closed'} {...context.getReferenceProps(props)}>
        {children}
      </div>
    )
  }
)

TooltipTrigger.displayName = 'TooltipTrigger'
