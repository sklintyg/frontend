import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Certificate from '../feature/certificate/Certificate'
import { CertificateHeader } from '../feature/certificate/CertificateHeader/CertificateHeader'
import { getCertificate } from '../store/certificate/certificateActions'
import { Container, Grid, Paper } from '@material-ui/core'
import CertificateSidePanel from '../feature/certificate/CertificateSidePanel/CertificateSidePanel'
import { AppHeader, AppHeaderLink } from '@frontend/common'
import WebcertTitle from '../components/header/WebcertTitle'
import WebcertHeaderUser from '../components/header/WebcertHeaderUser'
import RemovedCertificate from '../feature/certificate/RemovedCertificate/RemovedCertificate'
import { getIsCertificateDeleted } from '../store/certificate/certificateSelectors'

interface Props {
  themeToggler: JSX.Element
}

interface Params {
  id: string
}

const CertificatePage: React.FC<Props> = (props) => {
  const { id } = useParams<Params>()
  const dispatch = useDispatch()
  const certificateIsDeleted = useSelector(getIsCertificateDeleted())

  useEffect(() => {
    if (id) {
      dispatch(getCertificate(id))
    }
  }, [id])

  const secondaryItems = (
    <>
      <AppHeaderLink text={'Om Webcert'} link={'#'}></AppHeaderLink>
      {props.themeToggler}
    </>
  )

  return (
    <Paper style={{ height: '100vh' }} square elevation={0}>
      <AppHeader title={<WebcertTitle />} primaryItems={<WebcertHeaderUser />} secondaryItems={secondaryItems} />
      {certificateIsDeleted ? (
        <RemovedCertificate />
      ) : (
        <>
          <CertificateHeader />
          <div style={{ height: `calc(100vh - 230px` }} className={`ic-container`}>
            <div style={{ height: '100%' }} className="iu-grid-cols iu-grid-cols-12">
              <div style={{ overflowY: 'auto', height: '100%' }} className="iu-grid-span-8">
                <Certificate />
              </div>
              <div style={{ height: '100%' }} className="iu-grid-span-4">
                <CertificateSidePanel />
              </div>
            </div>
          </div>
        </>
      )}
    </Paper>
  )
}

export default CertificatePage
