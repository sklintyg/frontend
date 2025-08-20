import { FloatingFocusManager, FloatingPortal } from '@floating-ui/react'
import type { ReactNode } from 'react'
import { usePopoverContext } from './Popover'

export function PopoverContent({ children }: { children: ReactNode }) {
  const { context, refs, strategy, x, y, getFloatingProps } = usePopoverContext()

  return (
    <FloatingPortal>
      <FloatingFocusManager context={context} modal={false}>
        <div
          className="ids-select-multiple__dropdown__wrapper"
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
          <div className="ids-select-multiple__dropdown relative">
            <div className="ids-select-multiple__dropdown__inner">{children}</div>
          </div>
        </div>
      </FloatingFocusManager>
    </FloatingPortal>
  )
}
