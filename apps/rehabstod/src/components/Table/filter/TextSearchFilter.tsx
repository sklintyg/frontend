import { Input } from '../../form/Input/Input'
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
  return (
    <>
      <div className="print:hidden">
        <Input
          light
          description={description}
          label={title}
          placeholder={placeholder}
          value={textValue}
          onChange={(event) => {
            onTextSearchChange(event.currentTarget.value)
          }}
        />
      </div>
      <div className="hidden print:block">
        <PrintTitle title={title} />
        {textValue || '-'}
      </div>
    </>
  )
}
