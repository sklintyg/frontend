import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import Certificate from '../feature/certificate/Certificate'
import { CertificateHeader } from '../feature/certificate/CertificateHeader/CertificateHeader'
import { getCertificate } from '../store/certificate/certificateActions'
import { Container, Grid, Box, Paper } from '@material-ui/core'
import CertificateSidePanel from '../feature/certificate/CertificateSidePanel'
import { AppHeader } from '@frontend/common'
import WebcertTitle from '../components/header/WebcertTitle'
import WebcertHeaderUser from '../components/header/WebcertHeaderUser'
import { AppHeaderAbout } from '@frontend/common/src'

interface CertificatePageProps {
  themeToggler: JSX.Element
}

const CertificatePage: React.FC<CertificatePageProps> = (props) => {
  const { id } = useParams()
  const dispatch = useDispatch()

  useEffect(() => {
    if (id) {
      dispatch(getCertificate(id))
    }
  }, [id])

  const secondaryItems = (
    <>
      <AppHeaderAbout text={'Om Webcert'} link={'#'}></AppHeaderAbout>
      {props.themeToggler}
    </>
  )

  return (
    <Box height="100vh">
      <AppHeader title={<WebcertTitle />} primaryItems={<WebcertHeaderUser />} secondaryItems={secondaryItems} />
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
    </Box>
  )
}

export default CertificatePage
