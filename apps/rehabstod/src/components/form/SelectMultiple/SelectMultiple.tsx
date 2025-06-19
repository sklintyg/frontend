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
import '@inera/ids-design/components/form/select-multiple/select-multiple.css'
import { useId, useState, type ReactNode } from 'react'
import { classNames } from '../../../utils/classNames'
import { hasNoChildren } from '../../../utils/hasNoChildren'
import { FormTooltip } from '../FormTooltip'

export function SelectMultiple({
  children,
  description,
  disabled,
  id: controlledId,
  label,
  light = false,
  placeholder,
}: {
  children: ReactNode
  description: string
  disabled?: boolean
  id?: string
  label: string
  light?: boolean
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
  const uncontrolledId = useId()
  const id = controlledId ?? uncontrolledId

  if (hasNoChildren(children)) {
    return null
  }

  return (
    <>
      <div className="ids-label-tooltip-wrapper">
        <label htmlFor={id} className="ids-label">
          {label}
        </label>
        {description && <FormTooltip>{description}</FormTooltip>}
      </div>
      <div className="ids-select-multiple-wrapper" ref={refs.setReference}>
        <input
          id={id}
          type="button"
          aria-expanded={open}
          className={classNames('ids-select-multiple__select', light && 'ids-input--light')}
          value={placeholder}
          disabled={disabled}
          onClick={() => setOpen(!open)}
        />
      </div>
      {open && (
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
      )}
    </>
  )
}
