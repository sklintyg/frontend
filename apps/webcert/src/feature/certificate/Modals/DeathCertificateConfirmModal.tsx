import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import { createNewCertificate } from '../../../store/certificate/certificateActions'
import Checkbox from '../../../components/Inputs/Checkbox'
import InfoBox from '../../../components/utils/InfoBox'
import { ConfirmModal } from '../../../components/utils/Modal/ConfirmModal'
import { Patient } from '../../../types'

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

export const DeathCertificateConfirmModal: React.FC<Props> = ({ patient, setOpen, open }) => {
  const dispatch = useDispatch()
  const [disabled, setDisabled] = useState(true)

  return (
    <ConfirmModal
      modalTitle="Kontrollera namn och personnummer"
      confirmButtonText="Gå vidare"
      disabled={false}
      confirmButtonDisabled={disabled}
      setOpen={setOpen}
      open={open}
      onConfirm={() => dispatch(createNewCertificate({ certificateType: 'db', patientId: patient.personId.id }))}
    >
      <InfoBox type="info">
        <p>Du är på väg att utfärda ett dödsbevis för</p>
        <strong>
          {patient.fullName} - {patient.personId.id}
        </strong>
      </InfoBox>
      <ContentWrapper>
        <p>När dödsbevis signeras, skickas det samtidigt till Skatteverket och dödsfallet registreras.</p>
        <p>Ett dödsbevis utfärdat på fel person får stora konsekvenser för den enskilde personen.</p>
        <p>Kontrollera därför en extra gång att personuppgifterna stämmer.</p>
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
