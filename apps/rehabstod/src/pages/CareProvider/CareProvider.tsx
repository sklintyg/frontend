import { IDSAlert, IDSButton, IDSButtonGroup, IDSContainer } from '@frontend/ids-react-ts'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Checkbox } from '../../components/Form/Checkbox'
import { Mottagning, Vardenhet } from '../../schemas'
import { useChangeUnitMutation, useGetUserQuery } from '../../store/api'
import { useUpdateUserPreferences } from '../../store/hooks'
import { CareProviderItem } from './components/CareProviderItem'

export function CareProvider() {
  const navigate = useNavigate()
  const { isLoading, data: user } = useGetUserQuery()
  const [changeUnit] = useChangeUnitMutation()
  const { updateUserPreferences } = useUpdateUserPreferences()
  const [selectedUnit, setSelectedUnit] = useState<Vardenhet | null | Mottagning>(
    user?.valdVardenhet || user?.vardgivare[0]?.vardenheter[0] || null
  )
  const [selectedRadio, setSelectedRadio] = useState<string>(selectedUnit?.namn ?? '')
  const [isChecked, setIsChecked] = useState(false)

  const handleUpdatePreferences = () => {
    if (user && isChecked && selectedUnit) {
      updateUserPreferences({
        standardenhet: selectedUnit.id,
      })
    }
  }

  const handleChangeUnit = async () => {
    if (selectedUnit) {
      await changeUnit({
        vardenhet: {
          ...selectedUnit,
          id: selectedUnit.id,
        },
      })
    }
  }

  const handleClick = async () => {
    await handleChangeUnit()
    handleUpdatePreferences()
    navigate('/')
  }

  const handleCheck = (event: { target: { checked: boolean } }) => {
    setIsChecked(event.target.checked)
  }

  const handleChooseUnit = (event: React.ChangeEvent, unit: Vardenhet | Mottagning) => {
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
        <Checkbox label="Spara vald enhet som förvald" checked={isChecked} onChange={handleCheck} />
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
