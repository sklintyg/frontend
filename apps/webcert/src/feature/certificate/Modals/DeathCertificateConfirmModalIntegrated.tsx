import type React from 'react';
import { useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import Checkbox from '../../../components/Inputs/Checkbox'
import InfoBox from '../../../components/utils/InfoBox'
import { ConfirmModal } from '../../../components/utils/Modal/ConfirmModal'
import type { RootState } from '../../../store/store'
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

export const DeathCertificateConfirmModalIntegrated: React.FC<Props> = ({ certificateId, setOpen, open }) => {
  const [disabled, setDisabled] = useState(true)
  const deleteCertificate = useDeleteCertificate(certificateId)
  const patient = useSelector((state: RootState) => state.ui.uiCertificate.certificate?.metadata.patient)

  if (!patient) {
    return null
  }

  return (
    <ConfirmModal
      modalTitle="Kontrollera namn och personnummer"
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
        <p>Du är på väg att utfärda ett dödsbevis för</p>
        <p className="iu-fw-bold">
          {patient.fullName} - {patient.personId.id}
        </p>
      </InfoBox>
      <ContentWrapper>
        <p>När dödsbevis signeras, skickas det samtidigt till Skatteverket och dödsfallet registreras.</p>
        <p>Ett dödsbevis utfärdat på fel person får stora konsekvenser för den enskilde personen.</p>
        <p>Kontrollera därför en extra gång att personuppgifterna stämmer.</p>
        <p className="iu-fw-bold">Om fel personuppgifter visas ovan, välj Radera.</p>
        <Checkbox
          label="Jag har kontrollerat att uppgifterna stämmer."
          onChange={(event) => {
            setDisabled(!event.currentTarget.checked)
          }}
        />
      </ContentWrapper>
    </ConfirmModal>
  )
}
