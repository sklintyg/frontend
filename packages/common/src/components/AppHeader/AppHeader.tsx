import React from 'react'
import { AppBar, Box, Container, Link, Toolbar, Typography } from '@material-ui/core'
import makeStyles from '@material-ui/core/styles/makeStyles'

export interface AppHeaderProps {
  title: React.ReactNode
  primaryItems?: React.ReactNode
  secondaryItems?: React.ReactNode
}

const useStyles = makeStyles((theme) => ({
  appBar: {
    background: '#3d4260',
  },
  title: {},
  itemsWrapper: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
  },
  primaryItems: {
    display: 'flex',
    alignItems: 'center',
  },
  secondaryItems: {
    display: 'flex',
    marginLeft: 'auto',
    alignItems: 'center',
  },
}))

const AppHeader: React.FC<AppHeaderProps> = (props) => {
  const classes = useStyles()

  return (
    <AppBar className={classes.appBar} position={'static'}>
      <Container>
        <Toolbar disableGutters={true}>
          <Box className={classes.title}>{props.title}</Box>
          <Box className={classes.itemsWrapper}>
            <Box className={classes.primaryItems}>{props.primaryItems}</Box>
            <Box className={classes.secondaryItems}>{props.secondaryItems}</Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default AppHeader
