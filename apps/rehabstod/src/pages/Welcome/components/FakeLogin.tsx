import { IDSButton, IDSCard, IDSInput, IDSRadio, IDSSelect, IDSSpinner } from '@frontend/ids-react-ts'
import { useFakeLoginMutation } from '../../../store/testabilityApi'
import { useFakeLoginEffect } from '../hooks/useFakeLoginEffect'

export function FakeLogin() {
  const { isLoading, fakeLogins, selectedFilter, setSelectedFilter, selectedLogin, setSelectedLogin, selectedUnit, setSelectedUnit } =
    useFakeLoginEffect()
  const [login] = useFakeLoginMutation()

  const selectedLoginData = fakeLogins.find(({ hsaId }) => hsaId === selectedLogin)

  if (isLoading) {
    return <IDSSpinner data-testid="spinner" />
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
                setSelectedFilter(event.target.value)
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
            value={fakeLogins.find(({ hsaId }) => hsaId === selectedLogin)?.hsaId}
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
      {selectedLoginData?.beskrivning && <div>{selectedLoginData.beskrivning}</div>}
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
