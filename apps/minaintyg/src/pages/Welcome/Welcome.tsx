import { IDSButton, IDSContainer, IDSInput, IDSTextarea } from '@frontend/ids-react-ts'
import { ReactEventHandler, useRef, useState } from 'react'

const fakeUsers = [
  {
    personnummer: '191212121212',
    namn: 'Tolvan Tolvansson',
    sekretessmarkering: false,
  },
  {
    personnummer: '201212121212',
    namn: 'Lilltolvan Tolvansson',
    sekretessmarkering: false,
  },
]

export function Welcome() {
  const [profile, setProfile] = useState<string>(fakeUsers[0].personnummer)
  const [freeText, setFreeText] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit: ReactEventHandler = (event) => {
    event.preventDefault()
    window.location.assign(`/fake/sso`)
  }
  //           // testability/person (hämta testpersoner)
  return (
    <IDSContainer>
      <div className="ids-content py-4">
        <h1 className="ids-heading-2">Testinloggningar Mina Intyg</h1>
        <div className="w-6/12 flex-auto">
          <form id="loginForm" action="/fake/sso?personId=198901192396" method="POST" acceptCharset="UTF-8">
            <IDSButton type="submit">Logga in</IDSButton>
          </form>
        </div>
        <form ref={formRef} onSubmit={handleSubmit}>
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
                    {fakeUsers.map(({ personnummer, namn }) => (
                      <option key={personnummer} value={personnummer}>
                        {namn} ({personnummer}){' '}
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
                        : JSON.stringify(
                            fakeUsers.find(({ personnummer }) => personnummer === profile),
                            null,
                            2
                          )
                    }
                    onChange={(event) => setFreeText(event.target.value)}
                    className="h-40 w-full"
                    rows={5}
                  />
                </IDSTextarea>
              </label>
            </div>
          </div>
        </form>
        <IDSButton type="submit" onClick={handleSubmit}>
          Logga in
        </IDSButton>
      </div>
    </IDSContainer>
  )
}
