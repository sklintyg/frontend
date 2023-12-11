import { Dialog, Radio } from '@frontend/components'
import { IDSRadioGroup } from '@frontend/ids-react-ts'
import { ChangeEventHandler, ReactNode } from 'react'
import { AvailableFunction, InformationTypeEnum } from '../../../../schema/certificate.schema'

export function CustomizePrintDialog({
  open,
  children,
  onChange,
  currentValue,
  onOpenChange,
  fn: { title, body, description, information },
}: {
  open: boolean
  children: ReactNode
  currentValue: string
  onChange: ChangeEventHandler<HTMLInputElement>
  onOpenChange?: (open: boolean) => void
  fn: AvailableFunction
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} headline={title ?? ''}>
      <p className="mb-5">{body}</p>
      <IDSRadioGroup>
        {information
          .filter((info) => info.type === InformationTypeEnum.enum.OPTIONS)
          .map(({ id, text }) => (
            <Radio
              key={text}
              label={text}
              value={id || ''}
              name={`option-${id}`}
              checked={currentValue === (id || '')}
              onChange={onChange}
            />
          ))}
      </IDSRadioGroup>
      {currentValue === '!diagnoser' && <p className="mb-5">{description}</p>}
      {children}
    </Dialog>
  )
}
