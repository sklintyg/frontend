/* eslint-disable react/jsx-props-no-spreading */
import { IDSIconQuestion } from '@frontend/ids-react-ts'
import { ComponentProps, useId } from 'react'
import { classNames } from '../../utils/classNames'
import { TooltipIcon } from '../TooltipIcon/TooltipIcon'
import { Input } from './Input'

export function NumberInput({
  label,
  description,
  inline = false,
  ...props
}: ComponentProps<typeof Input> & {
  label: string
  description?: string
  inline?: boolean
}) {
  const id = useId()
  return (
    <div className={classNames(inline && 'flex items-baseline gap-3', 'w-full')}>
      <label htmlFor={id}>
        {label} {description && <TooltipIcon description={description} icon={<IDSIconQuestion size="s" />} />}
      </label>
      <Input type="number" id={id} {...props} />
    </div>
  )
}
