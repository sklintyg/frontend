import { IDSButton, IDSCard, IDSContainer } from '@frontend/ids-react-ts'
import { useState } from 'react'
import { useWelcome } from './useWelcome'

export function Welcome() {
  const [selectedLogin, setSelectedLogin] = useState<string>()
  const [selectedUnit, setSelectedUnit] = useState<string>()
  const [selectedFilter, setSelectedFilter] = useState('all')
  const { isLoading, fakeLogins } = useWelcome()

  if (isLoading) {
    return <>Loading</>
  }

  return (
    <IDSContainer>
      <div className="ids-content py-4">
        <h1 className="ids-heading-2">Testinloggningar Rehabstöd</h1>
        <div className="mb-7">
          <IDSCard fill>
            Templatelista till vänster - Manuella ändringar kan göras i jsonstrukturen - detta omvandlas till inloggad userContext
          </IDSCard>
        </div>
        <div className="flex space-x-7 pb-4">
          <div className="w-6/12 flex-auto">
            Visa Mallar för
            <div className="pb-2">
              {[
                ['all', 'All'],
                ['dev', 'Dev'],
                ['demo', 'Demo'],
              ].map(([id, label]) => (
                <label key={id} htmlFor={id} className="pr-2">
                  <input
                    type="radio"
                    value={id}
                    id={id}
                    onChange={(event) => {
                      setSelectedFilter(event.target.value)
                    }}
                    name="filter"
                    checked={selectedFilter === id}
                  />{' '}
                  {label}
                </label>
              ))}
            </div>
            <label htmlFor="fakelogin">
              Login
              <select
                id="fakelogin"
                onChange={(event) => {
                  const select = event.target
                  const [hsaId, unitId] = select.children[select.selectedIndex].id.split('_')
                  setSelectedLogin(hsaId)
                  setSelectedUnit(unitId)
                }}
                className="border-accent-40 w-full rounded border p-2">
                {fakeLogins
                  .filter(({ env }) => (selectedFilter === 'all' ? true : selectedFilter === env))
                  .map(({ hsaId, logins }) =>
                    logins.map(({ forvaldEnhet, beskrivning }) => (
                      <option key={`${hsaId}_${forvaldEnhet}`} id={`${hsaId}_${forvaldEnhet}`}>
                        {beskrivning}
                      </option>
                    ))
                  )}
              </select>
            </label>
          </div>
          <div className="w-6/12 flex-auto">
            <textarea
              value={JSON.stringify({ hsaId: selectedLogin, enhetId: selectedUnit }, null, 2)}
              className="border-accent-40 w-full whitespace-nowrap rounded border p-2"
              rows={4}
            />
          </div>
        </div>
        <IDSButton>Logga in</IDSButton>
      </div>
    </IDSContainer>
  )
}
