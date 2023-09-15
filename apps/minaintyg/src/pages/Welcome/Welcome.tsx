import { IDSButton, IDSContainer, IDSSpinner } from '@frontend/ids-react-ts'
import { useEffect, useRef, useState } from 'react'
import { useGetPersonsQuery } from '../../store/testabilityApi'
import { ResultTextArea } from './components/ResultTextArea'
import { SelectProfile } from './components/SelectProfile'

export function Welcome() {
  const [profile, setProfile] = useState<string>()
  const [freeText, setFreeText] = useState<string>()
  const { data: persons, isLoading } = useGetPersonsQuery()
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (!freeText && persons) {
      setProfile(persons.at(0)?.personId)
    }
  }, [freeText, persons])

  return (
    <IDSContainer>
      <div className="ids-content py-4">
        <h1 className="ids-heading-2">Testinloggningar Mina Intyg</h1>
        <form ref={formRef} action={`/fake/sso?personId=${profile}`} method="POST" acceptCharset="UTF-8">
          <div className="flex space-x-7 pb-4">
            {isLoading && <IDSSpinner />}
            {persons && (
              <>
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
              </>
            )}
          </div>
          <IDSButton type="submit">Logga in</IDSButton>
        </form>
      </div>
    </IDSContainer>
  )
}
