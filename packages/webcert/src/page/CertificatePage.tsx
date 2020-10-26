import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Certificate from '../feature/certificate/Certificate'
import { CertificateHeader } from '../feature/certificate/CertificateHeader/CertificateHeader'
import { getCertificate } from '../store/certificate/certificateActions'
import { Container, Grid, Link, Paper } from '@material-ui/core'
import CertificateSidePanel from '../feature/certificate/CertificateSidePanel/CertificateSidePanel'
import { AppHeader } from '@frontend/common'
import WebcertTitle from '../components/header/WebcertTitle'
import WebcertHeaderUser from '../components/header/WebcertHeaderUser'
import { AppHeaderLink } from '@frontend/common'
import RemovedCertificate from '../feature/certificate/RemovedCertificate/RemovedCertificate'
import { getCertificateIsDeleted } from '../store/certificate/certificateSelectors'

interface CertificatePageProps {
  themeToggler: JSX.Element
}

interface Params {
  id: string
}

const CertificatePage: React.FC<CertificatePageProps> = (props) => {
  const { id } = useParams<Params>()
  const dispatch = useDispatch()
  const certificateIsDeleted = useSelector(getCertificateIsDeleted())

  useEffect(() => {
    if (id) {
      dispatch(getCertificate(id))
    }
  }, [id])

  const secondaryItems = (
    <>
      <AppHeaderLink text={'Om Webcert'} link={'#'}></AppHeaderLink>
      {/* {props.themeToggler} */}
      <AppHeaderLink text={'Logga ut'} link={'/welcome'}></AppHeaderLink>
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
          <Container style={{ height: `calc(100vh - 180px` }}>
            <Grid container style={{ height: '100%' }}>
              <Grid item sm={8} style={{ overflowY: 'auto', height: '100%' }}>
                <Certificate />
              </Grid>
              <Grid item sm={4} style={{ height: '100%' }}>
                <CertificateSidePanel />
              </Grid>
            </Grid>
          </Container>
        </>
      )}
    </Paper>
  )
}

export default CertificatePage
