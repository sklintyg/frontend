import React from 'react'
import { useHistory } from 'react-router-dom'
import { ButtonWithConfirmModal, CertificateMetadata, FunctionDisabled } from '@frontend/common'
import { isReplaced, isReplacingCertificateRevoked } from '@frontend/common'
import { useDispatch, useSelector } from 'react-redux'
import { copyCertificate } from '../../../store/certificate/certificateActions'
import { getCertificateEvents } from '../../../store/certificate/certificateSelectors'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'
import _ from 'lodash'

interface Props extends FunctionDisabled {
  name: string
  description: string
  enabled: boolean
  certificateMetadata: CertificateMetadata
}

const CopyCertificateButton: React.FC<Props> = ({ name, description, enabled, certificateMetadata, functionDisabled }) => {
  const history = useHistory()
  const dispatch = useDispatch()
  const historyEntries = useSelector(getCertificateEvents, _.isEqual)

  let isCertReplaced = isReplaced(certificateMetadata)

  if (isCertReplaced) {
    const replacingIsRevoked = isReplacingCertificateRevoked(historyEntries)

    if (replacingIsRevoked) {
      isCertReplaced = false
    }
  }

  const handleConfirm = () => {
    if (isCertReplaced) {
      return () => history.push(`/certificate/${certificateMetadata.relations.children[0].certificateId}`)
    } else {
      return () => dispatch(copyCertificate(history))
    }
  }

  return (
    <ButtonWithConfirmModal
      name={name}
      description={description}
      disabled={!enabled}
      startIcon={<FontAwesomeIcon icon={faCopy} size="lg" />}
      modalTitle="Kopiera låst utkast"
      onConfirm={handleConfirm()}
      confirmButtonText={isCertReplaced ? 'Fortsätt på utkast' : 'Kopiera'}
      confirmButtonDisabled={functionDisabled}>
      <p>
        Genom att kopiera ett låst intygsutkast skapas ett nytt utkast med samma information som i det ursprungliga låsta utkastet. Du kan
        redigera utkastet innan du signerar det. Det ursprungliga låsta utkastet finns kvar.{' '}
      </p>
    </ButtonWithConfirmModal>
  )
}

export default CopyCertificateButton
