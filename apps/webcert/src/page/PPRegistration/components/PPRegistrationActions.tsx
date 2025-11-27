import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CustomButton } from '../../../components/Inputs/CustomButton'
import { ConfirmModal } from '../../../components/utils/Modal/ConfirmModal'
import { useLogout } from '../../../hooks/useLogout'

export function PPRegistrationAction({ prevStep, continueText = 'Fortsätt' }: { prevStep?: number; continueText?: string }) {
  const [showCancelModal, setShowCancelModal] = useState(false)
  const navigate = useNavigate()
  const { logout } = useLogout()

  return (
    <>
      <ConfirmModal
        modalTitle="Avbryt registrering?"
        confirmButtonText="Ja, lämna sidan"
        declineButtonText="Nej, stanna kvar"
        disabled={false}
        onConfirm={logout}
        open={showCancelModal}
        setOpen={setShowCancelModal}
      >
        Om du lämnar sidan sparas inte dina ändringar och registreringen avbryts. Vill du avbryta?
      </ConfirmModal>

      <div className="flex gap-5">
        <CustomButton onClick={() => setShowCancelModal(true)}>Avbryt</CustomButton>
        <CustomButton disabled={!prevStep} onClick={() => navigate(`/register/steg-${prevStep}`)}>
          Tillbaka
        </CustomButton>
        <CustomButton buttonStyle="primary" type="submit">
          {continueText}
        </CustomButton>
      </div>
    </>
  )
}
