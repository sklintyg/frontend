import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getCertificateEvents, getCertificateMetaData } from '../../../store/certificate/certificateSelectors'
import { CustomButton } from '@frontend/common'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons'
import { copyCertificate, renewCertificate } from '../../../store/certificate/certificateActions'
import { useHistory } from 'react-router-dom'
import { isReplaced, isReplacingCertificateRevoked } from '@frontend/common/src'

interface Props {
  name: string
  description: string
  enabled: boolean
}

const RenewCertificateButton: React.FC<Props> = ({ name, description, enabled }) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const certificateMetadata = useSelector(getCertificateMetaData)

  if (!certificateMetadata) return null

  const handleClick = () => {
    return () => dispatch(renewCertificate(history))
  }

  return (
    <CustomButton
      tooltip={description}
      disabled={!enabled}
      style="primary"
      text={name}
      startIcon={<FontAwesomeIcon icon={faSyncAlt} size="lg"></FontAwesomeIcon>}
      onClick={handleClick()}
    />
  )
}

export default RenewCertificateButton
