import { isDraft } from '@reduxjs/toolkit'
import React from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import { CustomButton } from '../../../components/Inputs/CustomButton'
import ButtonWithConfirmModal from '../../../components/utils/Modal/ButtonWithConfirmModal'
import { printImage } from '../../../images'
import { printCertificate } from '../../../store/certificate/certificateActions'
import type { CertificateMetadata } from '../../../types'
import { isLocked, sanitizeText } from '../../../utils'

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

const PrintCertificateButton = ({ name, description, enabled, certificateMetadata, body }: Props) => {
  const dispatch = useDispatch()
  const iframeRef = React.useRef<HTMLIFrameElement>(null)

  return (
    <>
      <IFrame ref={iframeRef}></IFrame>
      {body ? (
        <ButtonWithConfirmModal
          description={description}
          disabled={!enabled}
          buttonStyle="primary"
          name={name}
          modalTitle={isDraft(certificateMetadata) || isLocked(certificateMetadata) ? 'Skriv ut utkast' : 'Skriv ut intyg'}
          startIcon={<img src={printImage} alt="Skriva ut" />}
          onConfirm={() => iframeRef.current && dispatch(printCertificate({ ...certificateMetadata, iframe: iframeRef.current }))}
          confirmButtonText="Skriv ut"
          buttonTestId="print-certificate-button"
        >
          <div dangerouslySetInnerHTML={sanitizeText(body)}></div>
        </ButtonWithConfirmModal>
      ) : (
        <CustomButton
          tooltip={description}
          disabled={!enabled}
          buttonStyle="primary"
          data-testid="print-certificate-button"
          text={name}
          startIcon={<img src={printImage} alt="Skriva ut" />}
          onClick={() => iframeRef.current && dispatch(printCertificate({ ...certificateMetadata, iframe: iframeRef.current }))}
        />
      )}
    </>
  )
}

export default PrintCertificateButton
