import { Input } from '@frontend/components'
import { IDSIconQuestion } from '@frontend/ids-react-ts'
import { useId } from 'react'
import { TooltipIcon } from '../../TooltipIcon/TooltipIcon'
import { PrintTitle } from '../print/PrintTitle'

export function TextSearchFilter({
  title,
  description,
  placeholder,
  onTextSearchChange,
  textValue,
}: {
  title: string
  description: string
  onTextSearchChange: (value: string) => void
  placeholder: string
  textValue: string
}) {
  const handleTextSearchChanged = (value: string) => {
    onTextSearchChange(value)
  }
  const id = useId()
  return (
    <>
      <div className="print:hidden">
        <label htmlFor={id}>{title}</label>
        <TooltipIcon description={description} icon={<IDSIconQuestion size="s" className="relative top-1 ml-2" />} />
        <Input
          id={id}
          type="search"
          placeholder={placeholder}
          className="border-accent-40 bg-secondary-95 placeholder:text-neutral-20 mt-3 box-border w-full appearance-none truncate rounded border py-3 pl-5 pr-12 text-left"
          onChange={(event) => {
            handleTextSearchChanged(event.currentTarget.value)
          }}
          value={textValue}
        />
      </div>
      <div className="hidden print:block">
        <PrintTitle title={title} />
        {textValue || '-'}
      </div>
    </>
  )
}
