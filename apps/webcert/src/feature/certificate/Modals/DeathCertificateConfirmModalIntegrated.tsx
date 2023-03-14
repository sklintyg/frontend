import { Checkbox, ConfirmModal, InfoBox, Patient } from '@frontend/common'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import { deleteCertificate } from '../../../store/certificate/certificateActions'

interface Props {
  patient: Patient
  certificateId: string
  setOpen: (val: boolean) => void
  open: boolean
}

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1em;
`

export const DeathCertificateConfirmModalIntegrated: React.FC<Props> = ({ patient, certificateId, setOpen, open }) => {
  const dispatch = useDispatch()
  const [disabled, setDisabled] = useState(true)

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
      onClose={() => {
        dispatch(deleteCertificate({ certificateId }))
      }}
      closeOnBackdropClick={false}>
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
