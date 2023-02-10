import _ from 'lodash'
import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { getCertificateMetaData } from '../../../store/certificate/certificateSelectors'
import TextWithDynamicLinks from '../../../utils/TextWithDynamicLinks'
import AboutCertificatePanelFooter from './AboutCertificatePanelFooter'
import PanelHeader from './PanelHeader'

const Root = styled.div`
  height: 100%;
  overflow-y: auto;
`

const ContentWrapper = styled.div`
  padding: 16px;
  overflow-y: auto;
  margin-top: 0;

  ul {
    margin: 8px 0 8px 0;
  }
  p:last-of-type {
    padding-bottom: 50px;
  }
`

const Description = styled.p`
  white-space: pre-line;
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
      <Root>
        <ContentWrapper className="iu-border-grey-300">
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
          {certMetaData?.description && (
            <Description>
              <TextWithDynamicLinks text={certMetaData.description} />
            </Description>
          )}
        </ContentWrapper>
      </Root>
      <AboutCertificatePanelFooter />
    </>
  )
}

export default AboutCertificatePanel
