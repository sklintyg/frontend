import { IDSButton, IDSContainer, IDSInput, IDSTextarea } from '@frontend/ids-react-ts'
import { useRef, useState } from 'react'
import { useGetPersonsQuery } from '../../store/testabilityApi'

export function Welcome() {
  const [profile, setProfile] = useState<string>()
  const [freeText, setFreeText] = useState<string | null>(null)
  const { data: persons } = useGetPersonsQuery()
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <IDSContainer>
      <div className="ids-content py-4">
        <h1 className="ids-heading-2">Testinloggningar Mina Intyg</h1>
        <form ref={formRef} action={`/fake/sso?personId=${profile}`} method="POST" acceptCharset="UTF-8">
          <div className="flex space-x-7 pb-4">
            <div className="w-6/12 flex-auto">
              <label htmlFor="fakelogin">
                Login
                <IDSInput>
                  <select
                    id="fakelogin"
                    size={6}
                    onChange={({ target }) => {
                      setProfile(target.value)
                      setFreeText(null)
                    }}
                    value={profile}
                    className="h-40 w-full rounded border"
                  >
                    {persons &&
                      persons.map(({ personId, personName }) => (
                        <option key={personId} value={personId}>
                          {personName} ({personId}){' '}
                        </option>
                      ))}
                  </select>
                </IDSInput>
              </label>
            </div>
            <div className="w-6/12 flex-auto">
              <label htmlFor="userJsonDisplay">
                Result
                <IDSTextarea className="w-full whitespace-nowrap">
                  <textarea
                    id="userJsonDisplay"
                    name="userJsonDisplay"
                    value={
                      freeText != null
                        ? freeText
                        : JSON.stringify(persons && persons?.find(({ personId }) => personId === profile), null, 2)
                    }
                    onChange={(event) => setFreeText(event.target.value)}
                    className="h-40 w-full"
                    rows={5}
                  />
                </IDSTextarea>
              </label>
            </div>
          </div>
          <IDSButton type="submit">Logga in</IDSButton>
        </form>
      </div>
    </IDSContainer>
  )
}
