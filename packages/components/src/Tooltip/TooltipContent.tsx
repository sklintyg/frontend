import { FloatingPortal, useMergeRefs } from '@floating-ui/react'
import type { HTMLProps } from 'react'
import { forwardRef } from 'react'
import { useTheme } from '../theme/useTheme'
import { classNames, hasNoChildren } from '../utils'
import { useTooltipContext } from './hooks/useTooltipContext'

interface TooltipContentProps {
  clickable?: boolean
  small?: boolean
}

export const TooltipContent = forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement> & TooltipContentProps>(
  ({ clickable = true, small = false, ...props }, propRef) => {
    const { x, y, strategy, getFloatingProps, open, refs } = useTooltipContext()
    const ref = useMergeRefs([refs.setFloating, propRef])
    const theme = useTheme()

    if (!open || hasNoChildren(props.children)) return null

    return (
      <FloatingPortal>
        <div
          ref={ref}
          className={classNames(
            'z-50 max-w-xs whitespace-normal rounded border bg-white px-5 py-2.5 text-base font-normal md:max-w-sm',
            small ? 'text-sm' : 'text-base',
            !clickable && 'pointer-events-none',
            theme === 'inera-admin' && 'text-neutral-20 border-neutral-40',
            theme === '1177' && 'text-black border-neutral-50'
          )}
          style={{
            position: strategy,
            top: y ?? 0,
            left: x ?? 0,
            boxShadow: 'rgba(0, 0, 0, 0.3) 0px 0px 10px',
            ...props.style,
          }}
          {...getFloatingProps(props)}
        />
      </FloatingPortal>
    )
  }
)

TooltipContent.displayName = 'TooltipContent'
