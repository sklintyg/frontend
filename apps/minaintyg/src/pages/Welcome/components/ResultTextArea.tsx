import { IDSTextarea } from '@frontend/ids-react-ts'
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
    <IDSTextarea className="w-full whitespace-nowrap">
      <label htmlFor={id}>Result</label>
      <textarea
        id={id}
        value={freeText != null ? freeText : JSON.stringify(person, null, 2)}
        onChange={onChange}
        className="h-40 w-full"
        rows={5}
      />
    </IDSTextarea>
  )
}
