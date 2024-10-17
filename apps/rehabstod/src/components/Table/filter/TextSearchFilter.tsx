import { Input } from 'components'
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
