import { FloatingPortal, useMergeRefs } from '@floating-ui/react'
import React from 'react'
import { useTooltipContext } from './hooks/useTooltipContext'

export const TooltipContent = React.forwardRef<HTMLDivElement, React.HTMLProps<HTMLDivElement>>((props, propRef) => {
  const context = useTooltipContext()
  const ref = useMergeRefs([context.refs.setFloating, propRef])

  if (!context.open) return null

  return (
    <FloatingPortal>
      <div
        className="text-neutral-20 pointer-events-none z-50 max-w-xs whitespace-normal rounded bg-white py-3 px-5 text-base font-normal shadow-[0_0_10px_rgba(0,0,0,0.3)] md:max-w-sm"
        ref={ref}
        style={{
          position: context.strategy,
          top: context.y ?? 0,
          left: context.x ?? 0,
          // eslint-disable-next-line react/prop-types
          ...props.style,
        }}
        {...context.getFloatingProps(props)}
      />
    </FloatingPortal>
  )
})

TooltipContent.displayName = 'TooltipContent'
