import React from 'react'
import { useHistory } from 'react-router-dom'
import { ButtonWithConfirmModal, CertificateMetadata } from '@frontend/common'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'
import _ from 'lodash'
import { FunctionDisabled } from '../../../components/utils/functionDisablerUtils'

interface Props extends FunctionDisabled {
  name: string
  description: string
  enabled: boolean
  certificateMetadata: CertificateMetadata
}

const CopyCertificateContinueButton: React.FC<Props> = ({ name, description, enabled, certificateMetadata, functionDisabled }) => {
  const history = useHistory()

  const handleConfirm = () => {
    return () => history.push(`/certificate/${certificateMetadata.relations.children[0].certificateId}`)
  }

  return (
    <ButtonWithConfirmModal
      name={name}
      description={description}
      disabled={!enabled}
      startIcon={<FontAwesomeIcon icon={faCopy} size="lg" />}
      modalTitle="Kopiera låst utkast"
      onConfirm={handleConfirm()}
      confirmButtonText={'Fortsätt på utkast'}
      confirmButtonDisabled={functionDisabled}>
      <p>
        Genom att kopiera ett låst intygsutkast skapas ett nytt utkast med samma information som i det ursprungliga låsta utkastet. Du kan
        redigera utkastet innan du signerar det. Det ursprungliga låsta utkastet finns kvar.{' '}
      </p>
    </ButtonWithConfirmModal>
  )
}

export default CopyCertificateContinueButton
