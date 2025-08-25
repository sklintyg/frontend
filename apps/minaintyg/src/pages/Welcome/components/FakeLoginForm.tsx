import { Heading } from '@frontend/components'
import { tryCatch } from '@frontend/utils'
import { IDSButton, IDSButtonGroup } from '@inera/ids-react'
import { useEffect, useState } from 'react'
import type { TestabilityPerson } from '../../../schema/testability/person.schema'
import { useFakeLoginMutation } from '../../../store/testabilityApi'
import { ResultTextArea } from './ResultTextArea'
import { SelectProfile } from './SelectProfile'

export function FakeLoginForm({ persons }: { persons: TestabilityPerson[] }) {
  const [profile, setProfile] = useState<string | undefined>(persons[0]?.personId)
  const [freeText, setFreeText] = useState<string>()
  const [login] = useFakeLoginMutation()

  useEffect(() => {
    if (freeText) {
      const [id] = tryCatch(() => JSON.parse(freeText).personId)
      if (id && typeof id === 'string') {
        setProfile(id)
      } else {
        setProfile(undefined)
      }
    }
  }, [freeText, persons])

  return (
    <div className="ids-content py-4">
      <Heading level={1} size="m">
        Testinloggningar Mina Intyg
      </Heading>
      <div className="flex space-x-7 pb-4">
        <div className="w-6/12 flex-auto">
          <SelectProfile
            value={profile}
            persons={persons}
            onChange={({ target }) => {
              setProfile(target.value)
              setFreeText(undefined)
            }}
          />
        </div>
        <div className="w-6/12 flex-auto">
          <ResultTextArea
            person={persons.find(({ personId }) => personId === profile)}
            freeText={freeText}
            onChange={(event) => setFreeText(event.target.value)}
          />
        </div>
      </div>
      <IDSButtonGroup>
        <IDSButton secondary onClick={() => window.open('/saml2/authenticate/eleg', '_self')}>
          SAML Login
        </IDSButton>
        <IDSButton
          type="submit"
          disabled={!profile}
          onClick={() => {
            if (profile) {
              login({ personId: profile })
            }
          }}
        >
          Logga in
        </IDSButton>
      </IDSButtonGroup>
    </div>
  )
}
