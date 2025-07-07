import { IDSTextarea } from '@inera/ids-react'
import type { ChangeEventHandler } from 'react'
import { useId } from 'react'
import type { TestabilityPerson } from '../../../schema/testability/person.schema'

export function ResultTextArea({
  freeText,
  person,
  onChange,
}: {
  freeText?: string
  person?: TestabilityPerson
  onChange: ChangeEventHandler<HTMLTextAreaElement>
}) {
  const id = useId()
  return (
    <IDSTextarea
      id={id}
      className="w-full whitespace-nowrap"
      label="Result"
      value={freeText != null ? freeText : JSON.stringify(person, null, 2)}
      onChange={onChange}
      rows={5}
    />
  )
}
