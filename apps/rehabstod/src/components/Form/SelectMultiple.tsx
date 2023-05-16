import { IDSCheckboxGroup, IDSIcon } from '@frontend/ids-react-ts'
import { ReactNode, useId, useState } from 'react'
import { classNames } from '../../utils/classNames'
import { hasNoChildren } from '../../utils/hasNoChildren'
import { Popover } from '../Popover/Popover'
import { PopoverContent } from '../Popover/PopoverContent'
import { PopoverTrigger } from '../Popover/PopoverTrigger'
import { TooltipIcon } from '../TooltipIcon/TooltipIcon'
import { Input } from './Input'

export function SelectMultiple({
  actions,
  children,
  description,
  label,
  placeholder,
}: {
  actions?: ReactNode
  children: ReactNode
  description: string
  label: string
  placeholder: string
}) {
  const [open, setOpen] = useState(false)
  const id = useId()

  if (hasNoChildren(children)) {
    return null
  }

  const hasActions = !hasNoChildren(actions)

  return (
    <div className="inline-block w-full">
      <Popover open={open} onOpenChange={setOpen} role="listbox" refSized>
        <label htmlFor={id}>{label}</label>
        {description && <TooltipIcon description={description} name="question" size="s" className="relative top-1 ml-2" />}
        {/* TODO: Replace with IDSInput when working properly */}
        <div className="relative">
          <PopoverTrigger asChild>
            <Input hasIcon id={id} type="button" aria-expanded={open} value={placeholder} onClick={() => setOpen(!open)} />
          </PopoverTrigger>
          <IDSIcon
            size="xs"
            name="chevron-bold"
            className={classNames(open ? '-rotate-90' : 'rotate-90', 'top-1/2', 'absolute', 'right-6', '-translate-y-1/2')}
          />
        </div>

        {open && (
          <PopoverContent>
            <div className="relative max-h-96 overflow-auto py-1">
              <IDSCheckboxGroup compact>{children}</IDSCheckboxGroup>
            </div>
            {hasActions && (
              <div className="pt-2">
                <div className="border-neutral-90 flex grow items-center border-t pt-3">{actions}</div>
              </div>
            )}
          </PopoverContent>
        )}
      </Popover>
    </div>
  )
}
