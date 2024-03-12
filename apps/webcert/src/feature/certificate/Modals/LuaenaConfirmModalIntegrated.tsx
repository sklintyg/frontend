import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import Checkbox from '../../../components/Inputs/Checkbox'
import InfoBox from '../../../components/utils/InfoBox'
import { ConfirmModal } from '../../../components/utils/Modal/ConfirmModal'
import { RootState } from '../../../store/store'
import { useDeleteCertificate } from '../hooks/useDeleteCertificate'

interface Props {
  certificateId: string
  setOpen: (val: boolean) => void
  open: boolean
}

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1em;
`

export const LuaenaConfirmModalIntegrated: React.FC<Props> = ({ certificateId, setOpen, open }) => {
  const [disabled, setDisabled] = useState(true)
  const deleteCertificate = useDeleteCertificate(certificateId)
  const patient = useSelector((state: RootState) => state.ui.uiCertificate.certificate?.metadata.patient)

  if (!patient) {
    return null
  }

  return (
    <ConfirmModal
      modalTitle="Kontrollera att du använder dig av rätt läkarutlåtande"
      confirmButtonText="Gå vidare"
      declineButtonText="Radera"
      disabled={false}
      confirmButtonDisabled={disabled}
      setOpen={setOpen}
      open={open}
      onConfirm={() => null}
      onClose={deleteCertificate}
      closeOnBackdropClick={false}
    >
      <InfoBox type="info">
        <p>Du är på väg att utfärda Läkarutlåtande för aktivitetsersättning vid nedsatt arbetsförmåga för</p>
        <p className="iu-fw-bold">
          {patient.fullName} - {patient.personId.id}
        </p>
      </InfoBox>
      <ContentWrapper>
        <p>Läkarutlåtande för aktivitetsersättning vid nedsatt arbetsförmåga är till för personer under 30 år.</p>
        <p>För personer över 30 år rekommenderar vi Läkarutlåtande för sjukersättning.</p>
        <p>Kontrollera en extra gång att du använder dig av rätt läkarutlåtande.</p>
        <p>Om du valt fel intyg välj Radera.</p>
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
