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
import { IDSCheckboxGroup, IDSIcon } from '@frontend/ids-react-ts'
import { ReactNode, useId, useState } from 'react'
import { classNames } from '../../utils/classNames'
import { TooltipIcon } from '../TooltipIcon/TooltipIcon'
import { Input } from './Input'

export function SelectMultiple({
  label,
  description,
  children,
  placeholder,
}: {
  label: string
  description: string
  children: ReactNode
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

  if (!children || (children instanceof Array && children.length === 0)) {
    return null
  }

  return (
    <div>
      <label htmlFor={id}>{label}</label>
      {description && <TooltipIcon description={description} name="question" size="s" className="relative top-1 ml-2" />}
      {/* TODO: Replace with IDSInput when working properly */}
      <div className="relative">
        <Input
          hasIcon
          ref={refs.setReference}
          id={id}
          type="button"
          aria-expanded={open}
          value={placeholder}
          onClick={() => setOpen(!open)}
        />
        <IDSIcon
          size="xs"
          name="chevron-bold"
          className={classNames(open ? '-rotate-90' : 'rotate-90', 'top-1/2', 'absolute', 'right-6', '-translate-y-1/2')}
        />
      </div>
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
              {...getFloatingProps()}>
              <div className="relative max-h-96 overflow-auto">
                <IDSCheckboxGroup compact>{children}</IDSCheckboxGroup>
              </div>
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </div>
  )
}
