import { IDSContainer } from '@frontend/ids-react-ts'
import { FormEvent, useState } from 'react'

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

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    window.location.assign(`/web/sso?guid=${profile}`)
  }

  return (
    <IDSContainer>
      <div className="ids-content py-4">
        <h1 className="ids-heading-2">Testinloggningar Mina Intyg</h1>
        <form onSubmit={handleSubmit}>
          <div className="flex space-x-7 pb-4">
            <div className="w-6/12 flex-auto">
              <label htmlFor="fakelogin">
                Login
                <select
                  id="fakelogin"
                  onChange={({ target }) => {
                    setProfile(target.value)
                    setFreeText(null)
                  }}
                  value={profile}
                  className="border-accent-40 w-full rounded border p-2"
                >
                  {fakeUsers.map(({ personnummer, namn }) => (
                    <option key={personnummer} value={personnummer}>
                      {namn} ({personnummer})
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="w-6/12 flex-auto">
              <label htmlFor="userJsonDisplay">
                Result
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
                  className="border-accent-40 w-full whitespace-nowrap rounded border p-2"
                  rows={4}
                />
              </label>
              <button
                className="bg-primary-40 bg-sky-base hover:bg-sky-dark h-10 rounded-full px-7 font-semibold uppercase leading-5 text-white"
                type="submit"
              >
                Logga in
              </button>
            </div>
          </div>
        </form>
      </div>
    </IDSContainer>
  )
}
