import { FloatingFocusManager, FloatingPortal } from '@floating-ui/react'
import type { ReactNode } from 'react'
import { usePopoverContext } from './Popover'

export function PopoverContent({ children }: { children: ReactNode }) {
  const { context, refs, strategy, x, y, getFloatingProps } = usePopoverContext()
  return (
    <FloatingPortal>
      <FloatingFocusManager context={context} modal={false}>
        <div
          className="ids-content z-40 rounded bg-white p-2.5 shadow-[0_0_10px_rgba(0,0,0,0.3)]"
          ref={refs.setFloating}
          style={{
            position: strategy,
            top: y ?? 0,
            left: x ?? 0,
            minWidth: 100,
            outline: 0,
          }}
          {...getFloatingProps()}
        >
          {children}
        </div>
      </FloatingFocusManager>
    </FloatingPortal>
  )
}
