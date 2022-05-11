import React from 'react'
import { useDispatch } from 'react-redux'
import { printCertificate } from '../../../store/certificate/certificateActions'
import { CertificateMetadata, CustomButton, sanitizeText } from '@frontend/common'
import { ButtonWithConfirmModal, isDraft, isLocked } from '@frontend/common/src'
import styled from 'styled-components'
import print from '@frontend/common/src/images/print.svg'

interface Props {
  name: string
  description: string
  enabled: boolean
  body?: string
  certificateMetadata: CertificateMetadata
}

const IFrame = styled.iframe`
  display: none;
`

const PrintCertificateButton: React.FC<Props> = ({ name, description, enabled, certificateMetadata, body }) => {
  const dispatch = useDispatch()

  return (
    <>
      <IFrame name="printTargetIFrame"></IFrame>
      {body ? (
        <ButtonWithConfirmModal
          description={description}
          disabled={!enabled}
          buttonStyle="primary"
          name={name}
          modalTitle={isDraft(certificateMetadata) || isLocked(certificateMetadata) ? 'Skriv ut utkast' : 'Skriv ut intyg'}
          startIcon={<img src={print} alt="Skriva ut" />}
          onConfirm={() => dispatch(printCertificate(certificateMetadata))}
          confirmButtonText={'Skriv ut'}>
          <div dangerouslySetInnerHTML={sanitizeText(body)}></div>
        </ButtonWithConfirmModal>
      ) : (
        <CustomButton
          tooltip={description}
          disabled={!enabled}
          buttonStyle="primary"
          text={name}
          startIcon={<img src={print} alt="Skriva ut" />}
          onClick={() => dispatch(printCertificate(certificateMetadata))}
        />
      )}
    </>
  )
}

export default PrintCertificateButton
