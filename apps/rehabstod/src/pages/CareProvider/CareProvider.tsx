import { IDSAlert, IDSButton, IDSButtonGroup } from '@frontend/ids-react-ts'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Checkbox } from '../../components/Form/Checkbox'
import { Vardenhet, Vardgivare } from '../../schemas'
import { useChangeUnitMutation, useGetUserQuery } from '../../store/api'
import { CareProviderItem } from './components/CareProviderItem'

export function CareProvider() {
  const navigate = useNavigate()
  const { isLoading, data: user } = useGetUserQuery()
  const [changeUnit] = useChangeUnitMutation()
  const [selectedUnit, setSelectedUnit] = useState<Vardenhet | null>(null)
  const [selectedProvider, setSelectedProvider] = useState<Vardgivare | null>(null)
  const [selectedRadio, setSelectedRadio] = useState<string | null>(user?.valdVardenhet?.namn || null)
  const [isChecked, setIsChecked] = useState(false)

  const handleClick = () => {
    if (!user || !selectedUnit || !selectedProvider) return

    if (isChecked && selectedRadio) {
      const updatedUser = {
        ...user,
        valdVardenhet: {
          namn: selectedRadio,
        },
      }
      changeUnit({
        vardgivare: selectedProvider,
        vardenhet: {
          ...selectedUnit,
          id: selectedUnit.id,
        },
        user: updatedUser,
      })
    }
    navigate('/')
  }
  const handleCheck = (event: { target: { checked: boolean } }) => {
    setIsChecked(event.target.checked)
  }

  const handleChooseUnit = (event: React.ChangeEvent, provider: Vardgivare, unit: Vardenhet) => {
    setSelectedProvider(provider)
    setSelectedUnit(unit)
    setSelectedRadio(event.target.id)
  }

  return !isLoading && user ? (
    <div className="my-16 w-full px-4 md:w-1/2 md:px-0">
      <div className="mb-7">
        <h1 className="ids-heading-1 pt-8 pb-4">Välj enhet</h1>
        <p className="ids-preamble my-5">
          Du har behörighet för flera olika enheter. Välj den enhet du vill se pågående sjukfall för. Du kan byta enhet även efter
          inloggning.
        </p>
        {user.roleSwitchPossible && (
          <IDSAlert className="mb-5">
            <span className="flex items-center">
              Du har behörigheten Rehabkoordinator på någon/några av dina enheter. Var uppmärksam om att din roll kommer skifta från Läkare
              till Rehabkoordinator när du väljer att logga in på en sådan enhet.
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
        <IDSButton disabled={!user?.valdVardenhet} onClick={() => navigate('/')}>
          Avbryt
        </IDSButton>
        <IDSButton disabled={!selectedRadio} onClick={handleClick}>
          Välj
        </IDSButton>
      </IDSButtonGroup>
    </div>
  ) : null
}
