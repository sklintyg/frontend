import { useId } from 'react'
import { TooltipIcon } from '../../../../components/TooltipIcon/TooltipIcon'
import { Input } from '../../../../components/Form/Input'

export function TextSearchFilter({
  title,
  description,
  placeholder,
  onTextSearchChange,
}: {
  title: string
  description: string
  onTextSearchChange: (value: string) => void
  placeholder: string
}) {
  const handleTextSearchChanged = (value: string) => {
    onTextSearchChange(value)
  }
  const id = useId()
  return (
    <div>
      <label htmlFor={id}>{title}</label>
      <TooltipIcon description={description} name="question" size="s" className="relative top-1 ml-2" />
      <Input
        id={id}
        type="text"
        placeholder={placeholder}
        className="text-neutral-20 bg-secondary-95 border-accent-40 mt-3 box-border w-full appearance-none truncate rounded border py-3 pl-5 pr-12 text-left placeholder:italic"
        onChange={(event) => {
          handleTextSearchChanged(event.currentTarget.value)
        }}
      />
    </div>
  )
}
