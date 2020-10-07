import React from 'react'
import SyncAltIcon from '@material-ui/icons/SyncAlt'
import { useHistory } from 'react-router-dom'
import { ButtonWithConfirmModal } from '@frontend/common'
import { InfoBox, isReplaced } from '@frontend/common'
import { useDispatch, useSelector } from 'react-redux'
import { replaceCertificate } from '../../../store/certificate/certificateActions'
import { Typography } from '@material-ui/core'
import { getCertificateMetaData } from '../../../store/certificate/certificateSelectors'

const ReplaceCertificateButton = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const certificateMetadata = useSelector(getCertificateMetaData)
  if (!certificateMetadata) return null

  const isCertReplaced = isReplaced(certificateMetadata)

  const handleConfirm = () => {
    if (isCertReplaced) {
      return () => history.push(`/certificate/${certificateMetadata.relations.children[0].certificateId}`)
    } else {
      return () => dispatch(replaceCertificate(history))
    }
  }

  return (
    <ButtonWithConfirmModal
      buttonText="Ersätt"
      startIcon={<SyncAltIcon />}
      modalTitle="Ersätt intyg"
      onConfirm={handleConfirm()}
      confirmButtonText={isCertReplaced ? 'Fortsätt på utkast' : 'Ersätt'}>
      <>
        <InfoBox type="info">
          Om intyget innehåller ett allvarligt fel, till exemepel om det är utfärdat på fel patient, bör du istället makulera intyget.
        </InfoBox>
        <Typography>
          Ett intyg kan ersättas om det innehåller felaktiga uppgifter eller om ny information tillkommit efter att intyget utfärdades. När
          ett intyg ersätts med ett nytt skapas ett utkast, med samma information som i det ursprungliga intyget, som du kan redigera innan
          du signerar intyget.
        </Typography>
      </>
    </ButtonWithConfirmModal>
  )
}

export default ReplaceCertificateButton
