import _ from 'lodash'
import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { getCertificateMetaData } from '../../../store/certificate/certificateSelectors'
import TextWithDynamicLinks from '../../../utils/TextWithDynamicLinks'
import AboutCertificatePanelFooter from './AboutCertificatePanelFooter'
import PanelHeader from './PanelHeader'

const Content = styled.div`
  overflow-y: auto;
  flex-grow: 1;
  padding: 16px;

  ul {
    margin: 8px 0 8px 0;
  }

  p:last-of-type {
    padding-bottom: 50px;
  }
`
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: auto;
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
    <Wrapper>
      <PanelHeader description="Om intyget" />
      <Content className="iu-border-grey-300">
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
      </Content>
      <AboutCertificatePanelFooter />
    </Wrapper>
  )
}

export default AboutCertificatePanel
