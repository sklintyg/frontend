import type React from 'react'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import { createNewCertificate } from '../../../store/certificate/certificateActions'
import Checkbox from '../../../components/Inputs/Checkbox'
import InfoBox from '../../../components/utils/InfoBox'
import { ConfirmModal } from '../../../components/utils/Modal/ConfirmModal'
import type { Patient } from '../../../types'

interface Props {
  patient: Patient
  setOpen: (val: boolean) => void
  open: boolean
}

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1em;
`

export const LuaenaConfirmModal: React.FC<Props> = ({ patient, setOpen, open }) => {
  const dispatch = useDispatch()
  const [disabled, setDisabled] = useState(true)

  return (
    <ConfirmModal
      modalTitle="Kontrollera att du använder dig av rätt läkarutlåtande"
      confirmButtonText="Gå vidare"
      disabled={false}
      confirmButtonDisabled={disabled}
      setOpen={setOpen}
      open={open}
      onConfirm={() => dispatch(createNewCertificate({ certificateType: 'luae_na', patientId: patient.personId.id }))}
    >
      <InfoBox type="info">
        <p>Du är på väg att utfärda Läkarutlåtande för aktivitetsersättning vid nedsatt arbetsförmåga för</p>
        <strong>
          {patient.fullName} - {patient.personId.id}
        </strong>
      </InfoBox>
      <ContentWrapper>
        <p>Läkarutlåtande för aktivitetsersättning vid nedsatt arbetsförmåga är till för personer under 30 år.</p>
        <p>För personer över 30 år rekommenderar vi Läkarutlåtande för sjukersättning.</p>
        <p>Kontrollera en extra gång att du använder dig av rätt läkarutlåtande.</p>
        <Checkbox
          label="Jag är säker på att jag vill utfärda Läkarutlåtande för aktivitetsersättning vid nedsatt arbetsförmåga."
          onChange={(event) => {
            setDisabled(!event.currentTarget.checked)
          }}
        />
      </ContentWrapper>
    </ConfirmModal>
  )
}
