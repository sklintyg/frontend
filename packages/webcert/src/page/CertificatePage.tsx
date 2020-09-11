import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import Certificate from '../feature/certificate/Certificate'
import { CertificateHeader } from '../feature/certificate/CertificateHeader'
import { getCertificate } from '../store/actions/certificates'
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

  console.log('CertificatePage', id)

  useEffect(() => {
    if (id) {
      dispatch(getCertificate(id))
    }
  }, [dispatch, id])

  const secondaryItems = (
    <>
      <AppHeaderAbout text={'Om Webcert'} link={'#'}></AppHeaderAbout>
      {props.themeToggler}
    </>
  )

  return (
    <Paper>
      <Box display="flex" flexDirection="column" height="100vh">
        <AppHeader title={<WebcertTitle />} primaryItems={<WebcertHeaderUser />} secondaryItems={secondaryItems} />
        <CertificateHeader />
        <Container style={{ height: `calc(100vh - 191px` }}>
          <Grid container style={{ height: '100%' }}>
            <Grid item sm={8} style={{ overflowY: 'auto', height: '100%' }}>
              <Certificate />
            </Grid>
            <Grid container item sm={4} style={{ height: '100%' }}>
              <CertificateSidePanel />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Paper>
  )
}

export default CertificatePage
