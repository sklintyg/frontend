import { IDSAlert, IDSButton } from '@frontend/ids-react-ts'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Checkbox } from '../../components/Form/Checkbox'
import { PageContainer } from '../../components/PageContainer/PageContainer'
import { PageHeading } from '../../components/PageHeading/PageHeading'
import type { Mottagning, Vardenhet } from '../../schemas'
import { useChangeUnitMutation, useGetUserQuery } from '../../store/api'
import { useUpdateUserPreferences } from '../../store/hooks/useUpdateUserPreferences'
import { CareProviderItem } from './components/CareProviderItem'

export function CareProvider() {
  const navigate = useNavigate()
  const { data: user } = useGetUserQuery()
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

  if (!user) {
    return null
  }

  return (
    <PageContainer>
      <div className="max-w-3xl">
        <div className="mb-6">
          <PageHeading title="Välj enhet" />
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
          <p className="mb-2">
            Du har valt <span className="font-bold">{selectedRadio}</span>
          </p>
        ) : null}
        <div className="mb-2">
          <Checkbox label="Spara vald enhet som förvald" checked={isChecked} onChange={handleCheck} />
        </div>
        <div className="flex flex-col gap-5 md:flex-row">
          <IDSButton mblock disabled={!user?.valdVardenhet} onClick={() => navigate('/')} secondary>
            Avbryt
          </IDSButton>
          <IDSButton mblock onClick={handleClick}>
            Välj
          </IDSButton>
        </div>
      </div>
    </PageContainer>
  )
}
