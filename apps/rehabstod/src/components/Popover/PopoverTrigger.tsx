import { useMergeRefs } from '@floating-ui/react'
import { cloneElement, forwardRef, HTMLProps, isValidElement } from 'react'
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
      <div className="inline-block" ref={ref} data-state={context.open ? 'open' : 'closed'} {...context.getReferenceProps(props)}>
        {children}
      </div>
    )
  }
)

PopoverTrigger.displayName = 'PopoverTrigger'
