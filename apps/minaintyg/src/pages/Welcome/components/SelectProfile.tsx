import { IDSInput } from '@frontend/ids-react-ts'
import { ChangeEventHandler, useId } from 'react'
import { TestabilityPerson } from '../../../schema/testability/person.schema'

export function SelectProfile({
  value,
  persons,
  onChange,
}: {
  value?: string
  persons: TestabilityPerson[]
  onChange: ChangeEventHandler<HTMLSelectElement>
}) {
  const id = useId()
  return (
    <IDSInput>
      <label htmlFor={id}>Login</label>
      <select id={id} size={6} onChange={onChange} value={value} className="h-40 w-full rounded border">
        {persons &&
          persons.map(({ personId, personName }) => (
            <option key={personId} value={personId}>
              {personName} ({personId}){' '}
            </option>
          ))}
      </select>
    </IDSInput>
  )
}
