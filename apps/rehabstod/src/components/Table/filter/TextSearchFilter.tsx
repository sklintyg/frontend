import { useId } from 'react'
import { TooltipIcon } from '../../TooltipIcon/TooltipIcon'
import { Input } from '../../Form/Input'

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
        <TooltipIcon description={description} name="question" size="s" className="relative top-1 ml-2" />
        <Input
          id={id}
          type="search"
          placeholder={placeholder}
          className="bg-secondary-95 border-accent-40 placeholder:text-neutral-20 mt-3 box-border w-full appearance-none truncate rounded border py-3 pl-5 pr-12 text-left"
          onChange={(event) => {
            handleTextSearchChanged(event.currentTarget.value)
          }}
          value={textValue}
        />
      </div>
      <div className="hidden print:block">
        <p className="font-bold">{title}:</p>
        {textValue}
      </div>
    </>
  )
}
