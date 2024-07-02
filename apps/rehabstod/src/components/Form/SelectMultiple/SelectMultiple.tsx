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
import { classNames, hasNoChildren, Input } from '@frontend/components'
import { IDSIconChevronBold } from '@frontend/ids-react-ts'
import type { ReactNode } from 'react'
import { useId, useState } from 'react'

export function SelectMultiple({
  children,
  description,
  label,
  placeholder,
}: {
  children: ReactNode
  description: string
  label: string
  placeholder: string
}) {
  const [open, setOpen] = useState(false)
  const { x, y, strategy, refs, context } = useFloating({
    placement: 'bottom-start',
    open,
    onOpenChange: setOpen,
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
  const id = useId()

  if (hasNoChildren(children)) {
    return null
  }

  return (
    <div className="w-full">
      <Input
        label={label}
        description={description}
        ref={refs.setReference}
        id={id}
        type="button"
        aria-expanded={open}
        value={placeholder}
        onClick={() => setOpen(!open)}
        icon={
          <IDSIconChevronBold
            size="xs"
            className={classNames(
              open ? '-rotate-90' : 'rotate-90',
              'top-1/2',
              'absolute',
              'right-6',
              '-translate-y-1/2',
              'pointer-events-none'
            )}
          />
        }
      />
      {open && (
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
      )}
    </div>
  )
}
