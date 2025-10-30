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
} from '@floating-ui/react'
import '@inera/ids-design/components/form/select-multiple/select-multiple.css'
import { useId, useState, type ReactNode } from 'react'
import { classNames } from '../../utils/classNames'
import { hasNoChildren } from '../../utils/hasNoChildren'
import { InputLabel } from '../InputLabel/InputLabel'

export function SelectMultiple({
  children,
  description,
  disabled,
  id: controlledId,
  listBoxId,
  label,
  light = false,
  placeholder,
}: {
  children: ReactNode
  description: string
  listBoxId: string
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
            width: `${Math.max(rects.reference.width, 100)}px`,
          })
        },
        padding: 10,
      }),
    ],
  })
  const dismiss = useDismiss(context)
  const { getFloatingProps } = useInteractions([dismiss])
  const uncontrolledId = useId()
  const id = controlledId ?? uncontrolledId

  if (hasNoChildren(children)) {
    return null
  }

  return (
    <>
      <InputLabel htmlFor={id} description={description}>
        {label}
      </InputLabel>
      <div className="ids-select-multiple-wrapper">
        <input
          id={id}
          type="button"
          role="combobox"
          ref={refs.setReference}
          aria-controls={listBoxId}
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-label={label}
          className={classNames('ids-select-multiple__select', light && 'ids-input--light')}
          value={placeholder}
          disabled={disabled}
          onClick={() => setOpen(!open)}
        />
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
                <div className="ids-select-multiple__dropdown relative block">
                  <div className="ids-select-multiple__dropdown__inner">{children}</div>
                </div>
              </div>
            </FloatingFocusManager>
          </FloatingPortal>
        )}
      </div>
    </>
  )
}
