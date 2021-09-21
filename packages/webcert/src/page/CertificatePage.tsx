import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Certificate from '../feature/certificate/Certificate'
import CertificateHeader from '../feature/certificate/CertificateHeader/CertificateHeader'
import { getCertificate } from '../store/certificate/certificateActions'
import CertificateSidePanel from '../feature/certificate/CertificateSidePanel/CertificateSidePanel'
import { AppHeader, AppHeaderLink } from '@frontend/common'
import WebcertHeaderUser from '../components/header/WebcertHeaderUser'
import RemovedCertificate from '../feature/certificate/RemovedCertificate/RemovedCertificate'
import { getIsCertificateDeleted } from '../store/certificate/certificateSelectors'
import styled from 'styled-components/macro'
import logo from '../components/header/webcert_logo.png'
import WebcertHeaderUnit from '../components/header/WebcertHeaderUnit'

const Root = styled.div`
  height: 100vh;
`

const Overflow = styled.div`
  height: 100%;
  overflow-y: auto;
`

const Wrapper = styled.div`
  height: calc(100vh - 100px);
`

const Columns = styled.div`
  height: 100%;
`

interface Params {
  certificateId: string
}

const CertificatePage = () => {
  const { certificateId } = useParams<Params>()
  const dispatch = useDispatch()
  const certificateIsDeleted = useSelector(getIsCertificateDeleted())

  useEffect(() => {
    if (certificateId) {
      dispatch(getCertificate(certificateId))
    }
  }, [dispatch, certificateId])

  const secondaryItems = [<AppHeaderLink text={'Om Webcert'} link={'#'} withoutDivider={true}></AppHeaderLink>]

  // Todo: Remove fixed height below and do some JS magic to calculate the height.
  return (
    <Root>
      <AppHeader
        logo={logo}
        alt={'Logo Webcert'}
        primaryItems={[<WebcertHeaderUser />, <WebcertHeaderUnit />]}
        secondaryItems={secondaryItems}
      />
      {certificateIsDeleted ? (
        <RemovedCertificate />
      ) : (
        <>
          <CertificateHeader />
          <Wrapper className={`ic-container`}>
            <Columns className="iu-grid-cols iu-grid-cols-12 iu-grid-no-gap">
              <Overflow className="iu-grid-span-7">
                <Certificate />
              </Overflow>
              <Overflow className="iu-grid-span-5">
                <CertificateSidePanel />
              </Overflow>
            </Columns>
          </Wrapper>
        </>
      )}
    </Root>
  )
}

export default CertificatePage
