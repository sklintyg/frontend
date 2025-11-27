import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CustomButton } from '../../../components/Inputs/CustomButton'
import { ConfirmModal } from '../../../components/utils/Modal/ConfirmModal'
import { resetForm as resetStep01Form } from '../../../store/pp/ppStep01ReducerSlice'
import { resetForm as resetStep02Form } from '../../../store/pp/ppStep02ReducerSlice'
import { useAppDispatch } from '../../../store/store'

export function PPRegistrationAction({ prevStep, continueText = 'Fortsätt' }: { prevStep?: number; continueText?: string }) {
  const [showCancelModal, setShowCancelModal] = useState(false)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  return (
    <>
      <ConfirmModal
        modalTitle="Avbryt registrering?"
        confirmButtonText="Ja, lämna sidan"
        declineButtonText="Nej, stanna kvar"
        disabled={false}
        onConfirm={() => {
          dispatch(resetStep01Form())
          dispatch(resetStep02Form())
          navigate('/')
        }}
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
