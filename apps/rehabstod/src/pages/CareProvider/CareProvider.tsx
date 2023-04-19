import { IDSAlert, IDSButton, IDSButtonGroup, IDSContainer } from '@frontend/ids-react-ts'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Checkbox } from '../../components/Form/Checkbox'
import { Mottagning, Vardenhet, Vardgivare } from '../../schemas'
import { useChangeUnitMutation, useGetUserQuery, useUpdateUserPreferencesMutation } from '../../store/api'
import { CareProviderItem } from './components/CareProviderItem'

export function CareProvider() {
  const navigate = useNavigate()
  const { isLoading, data: user } = useGetUserQuery()
  const [changeUnit] = useChangeUnitMutation()
  const [UpdateUserPreferences] = useUpdateUserPreferencesMutation()

  const [selectedUnit, setSelectedUnit] = useState<Vardenhet | null | Mottagning>(null)
  const [selectedProvider, setSelectedProvider] = useState<Vardgivare | null>(null)

  const firstUnit = user?.vardgivare[0]?.vardenheter[0]?.namn || ''
  const [selectedRadio, setSelectedRadio] = useState<string>(user?.valdVardenhet?.namn || firstUnit)
  const [isChecked, setIsChecked] = useState(false)

  const handleUpdatePreferences = () => {
    if (user && isChecked && selectedUnit) {
      UpdateUserPreferences({
        ...user.preferences,
        standardenhet: selectedUnit.id,
      })
    }
  }

  const handleClick = () => {
    handleUpdatePreferences()

    if (selectedUnit && selectedProvider) {
      changeUnit({
        vardgivare: selectedProvider,
        vardenhet: {
          ...selectedUnit,
          id: selectedUnit.id,
        },
      })
    }
    navigate('/')
  }

  const handleCheck = (event: { target: { checked: boolean } }) => {
    setIsChecked(event.target.checked)
    handleUpdatePreferences()
  }

  const handleChooseUnit = (event: React.ChangeEvent, provider: Vardgivare, unit: Vardenhet | Mottagning) => {
    setSelectedProvider(provider)
    setSelectedUnit(unit)
    setSelectedRadio(event.target.id)
  }

  return !isLoading && user ? (
    <IDSContainer>
      <div className="w-full py-10 px-4 md:w-1/2 md:px-0">
        <div className="mb-6">
          <h1 className="ids-heading-1 ids-small pb-4">Välj enhet</h1>
          <p className="ids-preamble my-5">
            Du har behörighet för flera olika enheter. Välj den enhet du vill se pågående sjukfall för. Du kan byta enhet även efter
            inloggning.{' '}
          </p>
          {user.roleSwitchPossible && (
            <IDSAlert className="mb-5">
              <span className="flex items-center">
                Du har behörigheten Rehabkoordinator på någon/några av dina enheter. Var uppmärksam om att din roll kommer skifta från
                Läkare till Rehabkoordinator när du väljer att logga in på en sådan enhet.
              </span>
            </IDSAlert>
          )}
          {user.vardgivare.map((provider) => (
            <CareProviderItem key={provider.id} provider={provider} handleChooseUnit={handleChooseUnit} selectedRadio={selectedRadio} />
          ))}
        </div>
        {selectedRadio ? (
          <p>
            Du har valt <span className="font-bold">{selectedRadio}</span>
          </p>
        ) : null}
        <Checkbox label="Spara vald enhet som förvald" checked={isChecked} onChange={handleCheck} description="" id="" />
        <IDSButtonGroup>
          <IDSButton disabled={!user?.valdVardenhet} onClick={() => navigate('/')} secondary>
            Avbryt
          </IDSButton>
          <IDSButton onClick={handleClick}>Välj</IDSButton>
        </IDSButtonGroup>
      </div>
    </IDSContainer>
  ) : null
}
