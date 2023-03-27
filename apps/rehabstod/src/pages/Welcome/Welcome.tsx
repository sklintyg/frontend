import { IDSButton, IDSCard, IDSContainer } from '@frontend/ids-react-ts'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { RootState, useAppDispatch } from '../../store/store'
import { selectFilter, selectLogin, selectUnit, updateFreetext } from '../../store/welcomeSlice'
import { useWelcome } from './useWelcome'

export function Welcome() {
  const { selectedLogin, selectedUnit, freeText, selectedFilter } = useSelector((state: RootState) => state.welcome)
  const dispatch = useAppDispatch()

  const { isLoading, fakeLogins } = useWelcome()

  useEffect(() => {
    if (fakeLogins.length > 0) {
      if (!fakeLogins.find(({ hsaId }) => hsaId === selectedLogin)) {
        dispatch(selectLogin(fakeLogins[0].hsaId))
      }

      if (!fakeLogins.find(({ forvaldEnhet }) => forvaldEnhet === selectedUnit)) {
        dispatch(selectUnit(fakeLogins[0].hsaId))
      }
    }
  }, [dispatch, fakeLogins, selectedLogin, selectedUnit])

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
                      dispatch(selectFilter(event.target.value))
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
                  dispatch(selectLogin(hsaId))
                  dispatch(selectUnit(unitId))
                  dispatch(updateFreetext(null))
                }}
                className="border-accent-40 w-full rounded border p-2">
                {fakeLogins.map(({ hsaId, forvaldEnhet, beskrivning }) => (
                  <option key={`${hsaId}_${forvaldEnhet}`} id={`${hsaId}_${forvaldEnhet}`}>
                    {beskrivning}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="w-6/12 flex-auto">
            <form id="loginForm" action="/fake" method="POST" acceptCharset="UTF-8">
              <label htmlFor="userJsonDisplay">
                Result
                <textarea
                  id="userJsonDisplay"
                  name="userJsonDisplay"
                  value={freeText != null ? freeText : JSON.stringify({ hsaId: selectedLogin, enhetId: selectedUnit }, null, 2)}
                  onChange={(event) => dispatch(updateFreetext(event.target.value))}
                  className="border-accent-40 w-full whitespace-nowrap rounded border p-2"
                  rows={4}
                />
              </label>

              <IDSButton type="submit">Logga in</IDSButton>
            </form>
          </div>
        </div>
      </div>
    </IDSContainer>
  )
}
