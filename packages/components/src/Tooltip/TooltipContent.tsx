import { FloatingPortal, useMergeRefs } from '@floating-ui/react'
import type { HTMLProps } from 'react'
import { forwardRef, useContext } from 'react'
import { ThemeContext } from '../theme/ThemeContext'
import { classNames } from '../utils'
import { useTooltipContext } from './hooks/useTooltipContext'

export const TooltipContent = forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>((props, propRef) => {
  const context = useTooltipContext()
  const ref = useMergeRefs([context.refs.setFloating, propRef])
  const theme = useContext(ThemeContext)

  if (!context.open) return null

  return (
    <FloatingPortal>
      <div
        className={classNames(
          'pointer-events-none z-50 max-w-xs whitespace-normal rounded border bg-white px-5 py-2.5 text-base font-normal md:max-w-sm',
          theme === 'inera-admin' && 'text-neutral-20 border-neutral-40',
          theme === '1177' && 'text-black border-neutral-50'
        )}
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
