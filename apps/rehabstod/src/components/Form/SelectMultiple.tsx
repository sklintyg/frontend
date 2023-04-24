/* eslint-disable react/jsx-props-no-spreading */
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
  options,
  placeholder,
}: {
  label: string
  description: string
  options: ReactNode
  placeholder: string
}) {
  const [open, setOpen] = useState(false)
  const { x, y, strategy, refs, context } = useFloating({
    placement: 'bottom-start',
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(5),
      flip({ padding: 10 }),
      size({
        apply({ rects, elements, availableHeight }) {
          Object.assign(elements.floating.style, {
            maxHeight: `${Math.min(availableHeight, 600)}px`,
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

  if (!options || (options instanceof Array && options.length === 0)) {
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
              className="ids-content z-20 -mt-1 flex overflow-hidden rounded bg-white p-2.5 shadow-[0_0_10px_rgba(0,0,0,0.3)]"
              ref={refs.setFloating}
              style={{
                position: strategy,
                top: y ?? 0,
                left: x ?? 0,
                minWidth: 100,
                maxHeight: 600,
                outline: 0,
              }}
              {...getFloatingProps()}>
              <div className="h-auto w-full overflow-auto">
                <IDSCheckboxGroup compact>{options}</IDSCheckboxGroup>
              </div>
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </div>
  )
}
