import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons'
import { useHistory } from 'react-router-dom'
import { ButtonWithConfirmModal, InfoBox } from '@frontend/common'
import { useDispatch } from 'react-redux'
import { replaceCertificate } from '../../../store/certificate/certificateActions'

interface Props {
  name: string
  description: string
  enabled: boolean
}

const ReplaceCertificateButton: React.FC<Props> = ({ name, description, enabled }) => {
  const history = useHistory()
  const dispatch = useDispatch()

  const handleConfirm = () => {
    dispatch(replaceCertificate(history))
  }

  return (
    <ButtonWithConfirmModal
      name={name}
      description={description}
      disabled={!enabled}
      startIcon={<FontAwesomeIcon size="lg" icon={faExchangeAlt} />}
      modalTitle="Ersätt intyg"
      onConfirm={handleConfirm}
      confirmButtonText={'Ersätt'}>
      <>
        <InfoBox type="info">
          Om intyget innehåller ett allvarligt fel, till exempel om det är utfärdat på fel patient, bör du istället makulera intyget.
        </InfoBox>
        <p>
          Ett intyg kan ersättas om det innehåller felaktiga uppgifter eller om ny information tillkommit efter att intyget utfärdades. När
          ett intyg ersätts med ett nytt skapas ett utkast, med samma information som i det ursprungliga intyget, som du kan redigera innan
          du signerar intyget.
        </p>
      </>
    </ButtonWithConfirmModal>
  )
}

export default ReplaceCertificateButton
