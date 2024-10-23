import { IDSButton, IDSCard, IDSInput, IDSRadio, IDSSelect, IDSSpinner } from '@frontend/ids-react-ts'
import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { selectFilter } from '../../../store/slices/welcome.slice'
import { useFakeLoginMutation } from '../../../store/testabilityApi'
import { useWelcome } from '../useWelcome'

export function FakeLogin() {
  const { selectedFilter } = useAppSelector((state) => state.welcome)
  const [selectedLogin, setSelectedLogin] = useState('')
  const [selectedUnit, setSelectedUnit] = useState('')
  const dispatch = useAppDispatch()
  const { isLoading, fakeLogins } = useWelcome()
  const [login] = useFakeLoginMutation()

  useEffect(() => {
    if (fakeLogins.length > 0) {
      setSelectedLogin(fakeLogins[0].hsaId)
      setSelectedUnit(fakeLogins[0].forvaldEnhet)
    }
  }, [dispatch, fakeLogins])

  if (isLoading) {
    return <IDSSpinner />
  }

  return (
    <IDSCard fill={1}>
      Visa Mallar för
      <div className="mb-2.5">
        {[
          ['all', 'All'],
          ['dev', 'Dev'],
          ['demo', 'Demo'],
          ['utbildning', 'Utbildning'],
        ].map(([id, label]) => (
          <IDSRadio light key={id}>
            <input
              type="radio"
              value={id}
              id={id}
              onChange={(event) => {
                dispatch(selectFilter(event.target.value))
              }}
              name="filter"
              checked={selectedFilter === id}
            />
            <label htmlFor={id} className="pr-2">
              {label}
            </label>
          </IDSRadio>
        ))}
      </div>
      <div className="mb-2.5">
        <IDSSelect light>
          <label htmlFor="fakelogin">Login</label>
          <select
            id="fakelogin"
            onChange={({ target }) => {
              const selected = target.children[target.selectedIndex]
              const [hsaId, unitId] = selected.id.split('_')
              setSelectedLogin(hsaId)
              setSelectedUnit(unitId)
            }}
            className="w-full rounded border border-accent-40 p-2"
          >
            {fakeLogins.map(({ hsaId, forvaldEnhet, beskrivning }) => (
              <option key={`${hsaId}_${forvaldEnhet}`} id={`${hsaId}_${forvaldEnhet}`}>
                {beskrivning}
              </option>
            ))}
          </select>
        </IDSSelect>
      </div>
      <div className="mb-2.5">
        <IDSInput light>
          <label htmlFor="hsaId">hsaId</label>
          <input id="hsaId" type="text" onChange={(evt) => setSelectedLogin(evt.target.value)} value={selectedLogin} />
        </IDSInput>
      </div>
      <div className="mb-2.5">
        <IDSInput light>
          <label htmlFor="enhetId">enhetId</label>
          <input id="enhetId" type="text" onChange={(evt) => setSelectedUnit(evt.target.value)} value={selectedUnit} />
        </IDSInput>
      </div>
      <IDSButton sblock onclick={() => login({ hsaId: selectedLogin, enhetId: selectedUnit })}>
        Logga in
      </IDSButton>
    </IDSCard>
  )
}
