import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  FloatingPortal,
  offset,
  size,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from '@floating-ui/react'
import { IDSIconChevron } from '@frontend/ids-react-ts'
import { ReactNode } from 'react'
import { hasNoChildren } from '../../utils/hasNoChildren'

export function SelectButton({
  title,
  children,
  open,
  handleOpenChange,
}: {
  title: string
  children: ReactNode
  open: boolean
  handleOpenChange: (isOpen: boolean) => void
}) {
  const { x, y, strategy, refs, context } = useFloating({
    placement: 'bottom-start',
    open,
    onOpenChange: handleOpenChange,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(1),
      flip({ padding: 10 }),
      size({
        apply({ rects, elements }) {
          Object.assign(elements.floating.style, {
            width: `${rects.reference.width}px`,
          })
        },
        padding: 10,
      }),
    ],
  })
  const dismiss = useDismiss(context)
  const role = useRole(context, { role: 'listbox' })
  const { getFloatingProps } = useInteractions([dismiss, role])

  if (hasNoChildren(children)) {
    return null
  }

  return (
    <div aria-expanded={open}>
      <button
        className="flex w-28 items-center justify-between gap-2"
        type="button"
        onClick={(event) => {
          handleOpenChange(!open)
          event.stopPropagation()
        }}
        ref={refs.setReference}
      >
        {title}
        <IDSIconChevron size="xs" rotate={open ? '270' : '90'} colorpreset={1} className="mr-2 inline" />
      </button>
      {open && (
        <FloatingPortal>
          <FloatingFocusManager context={context} modal={false}>
            <div
              className="ids-content z-40 w-32 rounded bg-white p-2.5 shadow-[0_0_10px_rgba(0,0,0,0.3)]"
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
              <div className="relative flex max-h-96 flex-col overflow-auto py-1">{children}</div>
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </div>
  )
}
