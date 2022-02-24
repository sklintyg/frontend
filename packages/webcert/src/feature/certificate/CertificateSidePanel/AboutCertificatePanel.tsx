import React, { useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import { getCertificateMetaData } from '../../../store/certificate/certificateSelectors'
import AboutCertificatePanelFooter from './AboutCertificatePanelFooter'
import PanelHeader from './PanelHeader'
import styled from 'styled-components'
import _ from 'lodash'

const Root = styled.div`
  height: 100%;
  overflow-y: auto;
`

interface StyledProps {
  shouldLimitHeight: boolean
  headerHeight: number
}

const ContentWrapper = styled.div<StyledProps>`
  padding: 16px;
  height: ${(props) => (props.shouldLimitHeight ? `calc(100% -  ${props.headerHeight}px);` : '100%;')};
  overflow-y: auto;
  margin-top: 0;

  ul {
    margin: 8px 0 8px 0;
  }
`

const Description = styled.p`
  white-space: pre-line;
  margin-top: 8px;
`

const CertificateVersion = styled.span`
  font-weight: 400;
  font-size: 14px;
  margin-left: 8px;
  text-transform: uppercase;
`

interface Props {
  headerHeight: number
}

const AboutCertificatePanel: React.FC<Props> = ({ headerHeight }) => {
  const certMetaData = useSelector(getCertificateMetaData, _.isEqual)
  const [shouldLimitHeight, setShouldLimitHeight] = useState(false)

  const contentRef = useCallback((node: HTMLDivElement) => {
    setShouldLimitHeight(node ? node.scrollHeight > node.clientHeight : false)
  }, [])

  return (
    <>
      <PanelHeader description="Om intyget" />
      <Root>
        <ContentWrapper ref={contentRef} className={`iu-border-grey-300`} headerHeight={headerHeight} shouldLimitHeight={shouldLimitHeight}>
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
      </Root>
      <AboutCertificatePanelFooter />
    </>
  )
}

export default AboutCertificatePanel
