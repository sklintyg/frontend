import React from 'react'
import { useHistory } from 'react-router-dom'
import { ButtonWithConfirmModal, CertificateMetadata } from '@frontend/common'
import { useDispatch } from 'react-redux'
import { copyCertificate } from '../../../store/certificate/certificateActions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'
import { FunctionDisabled } from '../../../utils/functionDisablerUtils'

interface Props extends FunctionDisabled {
  name: string
  description: string
  enabled: boolean
  certificateMetadata: CertificateMetadata
}

const CopyCertificateButton: React.FC<Props> = ({ name, description, enabled, functionDisabled }) => {
  const history = useHistory()
  const dispatch = useDispatch()

  const handleConfirm = () => {
    return () => dispatch(copyCertificate(history))
  }

  return (
    <ButtonWithConfirmModal
      name={name}
      description={description}
      disabled={!enabled}
      startIcon={<FontAwesomeIcon icon={faCopy} size="lg" />}
      modalTitle="Kopiera låst utkast"
      onConfirm={handleConfirm()}
      confirmButtonText={'Kopiera'}
      confirmButtonDisabled={functionDisabled}
      buttonTestId="copy-certificate-button">
      <div>
        <p>
          Genom att kopiera ett låst intygsutkast skapas ett nytt utkast med samma information som i det ursprungliga låsta utkastet. Du kan
          redigera utkastet innan du signerar det. Det ursprungliga låsta utkastet finns kvar.
        </p>
        <br />
        <p>Det nya utkastet skapas på den enhet du är inloggad på.</p>
      </div>
    </ButtonWithConfirmModal>
  )
}

export default CopyCertificateButton
