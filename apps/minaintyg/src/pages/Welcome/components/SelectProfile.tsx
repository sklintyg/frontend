import { IDSSelect } from '@inera/ids-react'
import type { ChangeEventHandler } from 'react'
import { useId } from 'react'
import type { TestabilityPerson } from '../../../schema/testability/person.schema'

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
    <IDSSelect label="Login" id={id} size={6} onChange={onChange} value={value} className="h-40 w-full rounded border">
      {persons &&
        persons.map(({ personId, personName }) => (
          <option key={personId} value={personId}>
            {personName} ({personId}){' '}
          </option>
        ))}
    </IDSSelect>
  )
}
