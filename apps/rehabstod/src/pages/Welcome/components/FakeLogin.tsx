import { Input, Radio, Select } from '@frontend/components'
import { IDSButton, IDSCard, IDSSpinner } from '@frontend/ids-react-ts'
import { ErrorAlert } from '../../../components/error/ErrorAlert/ErrorAlert'
import { useFakeLoginMutation } from '../../../store/testabilityApi'
import { useFakeLoginEffect } from '../hooks/useFakeLoginEffect'

export function FakeLogin() {
  const {
    isLoading,
    fakeLogins,
    selectedFilter,
    setSelectedFilter,
    selectedLogin,
    setSelectedLogin,
    selectedUnit,
    setSelectedUnit,
    error,
  } = useFakeLoginEffect()
  const [login] = useFakeLoginMutation()

  const templates = [
    ['all', 'All'],
    ['dev', 'Dev'],
    ['demo', 'Demo'],
    ['utbildning', 'Utbildning'],
  ]

  if (isLoading) {
    return <IDSSpinner data-testid="spinner" />
  }

  return (
    <>
      {error && (
        <div className="mb-7">
          <ErrorAlert heading="Tekniskt fel" errorType="error" text="Kunde inte hämta HSA data" error={error} dynamicLink={false} />
        </div>
      )}
      <IDSCard fill={1}>
        {!error && (
          <fieldset className="mb-2 flex gap-2">
            <legend className="ids-label">Visa Mallar för</legend>
            {templates.map(([id, label]) => (
              <Radio
                label={label}
                key={id}
                id={id}
                value={id}
                checked={selectedFilter === id}
                light
                onChange={(event) => {
                  setSelectedFilter(event.target.value)
                }}
              />
            ))}
          </fieldset>
        )}
        <div className="mb-7 flex flex-col gap-7">
          <Select
            light
            label="Login"
            disabled={Boolean(error)}
            value={`${selectedLogin}_${selectedUnit}`}
            options={fakeLogins.map(({ hsaId, forvaldEnhet, beskrivning }) => ({ value: `${hsaId}_${forvaldEnhet}`, label: beskrivning }))}
            onChange={({ target }) => {
              const [hsaId, unitId] = target.value.split('_')
              setSelectedLogin(hsaId)
              setSelectedUnit(unitId)
            }}
          />
          <Input light label="hsaId" onChange={(evt) => setSelectedLogin(evt.currentTarget.value)} value={selectedLogin} />
          <Input light label="enhetId" onChange={(evt) => setSelectedUnit(evt.currentTarget.value)} value={selectedUnit} />
        </div>
        <IDSButton sblock onclick={() => login({ hsaId: selectedLogin, enhetId: selectedUnit })}>
          Logga in
        </IDSButton>
      </IDSCard>
    </>
  )
}
