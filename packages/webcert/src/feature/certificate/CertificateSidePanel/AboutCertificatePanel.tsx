import React from 'react'
import { useSelector } from 'react-redux'
import { getCertificateMetaData } from '../../../store/certificate/certificateSelectors'
import AboutCertificatePanelFooter from './AboutCertificatePanelFooter'
import PanelHeader from './PanelHeader'
import styled from 'styled-components'
import _ from 'lodash'

const ContentWrapper = styled.div`
  padding: 16px;
  height: 100%;
  overflow-y: auto;
  margin-top: 0;

  ul {
    margin: 8px 0 8px 0;
  }
`

const Description = styled.p`
  white-space: pre-line;
  margin-top: 8px;
  font-size: 14px;
`

const CertificateVersion = styled.span`
  font-weight: 400;
  font-size: 14px;
  margin-left: 8px;
  text-transform: uppercase;
`

const AboutCertificatePanel: React.FC = () => {
  const certMetaData = useSelector(getCertificateMetaData, _.isEqual)

  return (
    <>
      <PanelHeader description="Om intyget" />
      <ContentWrapper className={`iu-border-grey-300`}>
        <p className="iu-fw-heading">
          {certMetaData && (
            <>
              {certMetaData.name}
              <CertificateVersion>
                {certMetaData.typeName ? certMetaData.typeName : certMetaData.type} {certMetaData.typeVersion}
              </CertificateVersion>
            </>
          )}
        </p>
        {certMetaData && <Description dangerouslySetInnerHTML={{ __html: certMetaData.description }} />}
      </ContentWrapper>
      <AboutCertificatePanelFooter />
    </>
  )
}

export default AboutCertificatePanel
