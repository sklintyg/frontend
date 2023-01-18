import { sanitizeText } from '@frontend/common'
import _ from 'lodash'
import React, { useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { getCertificateMetaData } from '../../../store/certificate/certificateSelectors'
import WCDynamicLink from '../../../utils/WCDynamicLink'
import AboutCertificatePanelFooter from './AboutCertificatePanelFooter'
import PanelHeader from './PanelHeader'

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
  p:last-of-type {
    padding-bottom: 50px;
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

  const hasDynamicLink = (text?: string): boolean => {
    if (!text) {
      return false
    }
    return text.split('<LINK:').length > 1
  }

  const formatText = (text?: string) => {
    if (!text) {
      return ''
    }
    const splitText = text.split('<LINK:')
    if (splitText.length > 1) {
      for (let i = 0; i < splitText.length - 1; i++) {
        const dynamicLinkKey = splitText[i + 1].split('>')[0]
        const textAfterLink = splitText[i + 1].split('>')[1]
        return (
          <>
            <p>
              {splitText[i]}
              <WCDynamicLink linkKey={dynamicLinkKey} />
              {textAfterLink}
            </p>
          </>
        )
      }
    }
    return text
  }

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
          {certMetaData &&
            (hasDynamicLink(certMetaData.description) ? (
              <Description>{formatText(certMetaData.description)}</Description>
            ) : (
              <Description dangerouslySetInnerHTML={sanitizeText(certMetaData.description)} />
            ))}
        </ContentWrapper>
      </Root>
      <AboutCertificatePanelFooter />
    </>
  )
}

export default AboutCertificatePanel
