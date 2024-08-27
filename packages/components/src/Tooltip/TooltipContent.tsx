import { FloatingPortal, useMergeRefs } from '@floating-ui/react'
import type { HTMLProps } from 'react'
import { forwardRef } from 'react'
import { useTooltipContext } from './hooks/useTooltipContext'

export const TooltipContent = forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>((props, propRef) => {
  const context = useTooltipContext()
  const ref = useMergeRefs([context.refs.setFloating, propRef])

  if (!context.open) return null

  return (
    <FloatingPortal>
      <div
        className="pointer-events-none z-50 max-w-xs whitespace-normal rounded border border-tooltip-border-color bg-white px-5 py-2.5 text-base font-normal text-tooltip-color md:max-w-sm"
        ref={ref}
        style={{
          position: context.strategy,
          top: context.y ?? 0,
          left: context.x ?? 0,
          boxShadow: 'rgba(0, 0, 0, 0.3) 0px 0px 10px',
          ...props.style,
        }}
        {...context.getFloatingProps(props)}
      />
    </FloatingPortal>
  )
})

TooltipContent.displayName = 'TooltipContent'
