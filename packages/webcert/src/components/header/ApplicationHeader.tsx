import * as React from 'react'
import { AppBar, Toolbar, Box, Typography, Container, Link } from '@material-ui/core'
import PersonIcon from '@material-ui/icons/Person'
import ApartmentIcon from '@material-ui/icons/Apartment'
import WebcertTitle from './WebcertTitle'

type ApplicationHeaderProps = {
  themeToggler: JSX.Element
}

export const ApplicationHeader: React.FC<ApplicationHeaderProps> = (props) => {
  return (
    <AppBar position={'static'}>
      <Container>
        <Toolbar disableGutters={true}>
          <WebcertTitle />
          <Box marginLeft={5} display="flex" flexDirection="row" alignItems="center">
            <Box clone marginRight={'10px'}>
              <PersonIcon />
            </Box>
            <Typography variant={'body1'} style={{ fontWeight: 'bold', marginRight: '5px' }}>
              Arnold Johansson
            </Typography>
            <Typography variant={'body1'}>- Läkare</Typography>
          </Box>
          <Box marginLeft={5} display="flex" flexDirection="row" alignItems="center" flexGrow={1}>
            <Box clone marginRight={'10px'}>
              <ApartmentIcon />
            </Box>
            <Typography variant={'body1'} style={{ fontWeight: 'bold', marginRight: '5px' }}>
              Region Jämtland Härjedalen
            </Typography>
            <Typography variant={'body1'}>- Frösö Hälsocentral</Typography>
          </Box>
          <Typography>
            <Link href="#" color={'inherit'}>
              Om Webcert
            </Link>
            {props.themeToggler}
          </Typography>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
