import React from 'react'
import { useDispatch } from 'react-redux'
import { printCertificate } from '../../../store/certificate/certificateActions'
import { CertificateMetadata, CustomButton, sanitizeText, ButtonWithConfirmModal, isDraft, isLocked } from '@frontend/common'
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
  const iframeRef = React.useRef<HTMLIFrameElement>(null)

  const getButton = (iframe: HTMLIFrameElement) => {
    return body ? (
      <ButtonWithConfirmModal
        description={description}
        disabled={!enabled}
        buttonStyle="primary"
        name={name}
        modalTitle={isDraft(certificateMetadata) || isLocked(certificateMetadata) ? 'Skriv ut utkast' : 'Skriv ut intyg'}
        startIcon={<img src={print} alt="Skriva ut" />}
        onConfirm={() => dispatch(printCertificate({ ...certificateMetadata, iframe }))}
        confirmButtonText={'Skriv ut'}
        buttonTestId="print-certificate-button">
        <div dangerouslySetInnerHTML={sanitizeText(body)}></div>
      </ButtonWithConfirmModal>
    ) : (
      <CustomButton
        tooltip={description}
        disabled={!enabled}
        buttonStyle="primary"
        data-testid="print-certificate-button"
        text={name}
        startIcon={<img src={print} alt="Skriva ut" />}
        onClick={() => dispatch(printCertificate({ ...certificateMetadata, iframe }))}
      />
    )
  }
  return (
    <>
      <IFrame ref={iframeRef}></IFrame>
      {iframeRef.current ? getButton(iframeRef.current) : <></>}
    </>
  )
}

export default PrintCertificateButton
