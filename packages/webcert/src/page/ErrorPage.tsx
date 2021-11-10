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
import MajorVersionNotification from '../feature/certificate/Notifications/MajorVersionNotification'
import { TIMEOUT } from '../store/error/errorReducer'
import { Link } from 'react-scroll'

const Root = styled.div`
  height: 100vh;
`

interface ErrorPageProps {
  errorCode: string
}

const ErrorPage: React.FC<ErrorPageProps> = ({ errorCode }) => {
  const getContent = () => {
    switch (errorCode) {
      case TIMEOUT:
        return (
          <div>
            <strong>Du är utloggad</strong>
            <p>
              Du har blivit utloggad från Webcert på grund av inaktivitet. Om du vill fortsätta använda Webcert behöver du logga in igen.
            </p>
            <Link to={'/'}>Gå till startsidan</Link>
          </div>
        )
    }
  }

  return (
    <Root>
      <AppHeader logo={logo} alt={'Logo Webcert'} />
    </Root>
  )
}

export default ErrorPage
