import { IDSAlert, IDSButton, IDSButtonGroup } from '@frontend/ids-react-ts'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useChangeUnitMutation, useGetUserQuery } from '../../store/api'
import { Vardenheter, Vardgivare } from '../../store/types/user'
import { CareProviderList } from './components/CareProviderList'

export function CareProvider() {
  const navigate = useNavigate()
  const { isLoading, data: user } = useGetUserQuery()
  const [changeUnit] = useChangeUnitMutation()
  const [selectedUnit, setSelectedUnit] = useState<Vardenheter | null>(null)
  const [selectedProvider, setSelectedProvider] = useState<Vardgivare | null>(null)
  const [selectedRadio, setSelectedRadio] = useState<string | null>(null)

  const handleClick = () => {
    if (!user || !selectedUnit || !selectedProvider) return

    changeUnit({
      vardgivare: selectedProvider,
      vardenhet: {
        ...selectedUnit,
        id: selectedUnit.id,
      },
    })
    navigate('/')
  }

  const handleChooseUnit = (event: React.ChangeEvent<HTMLInputElement>, provider: Vardgivare, unit: Vardenheter) => {
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
        <CareProviderList user={user} handleChooseUnit={handleChooseUnit} selectedRadio={selectedRadio} />
      </div>

      <IDSButtonGroup>
        <IDSButton disabled>Avbryt</IDSButton>
        <IDSButton onClick={handleClick}>Välj</IDSButton>
      </IDSButtonGroup>
    </div>
  ) : null
}
