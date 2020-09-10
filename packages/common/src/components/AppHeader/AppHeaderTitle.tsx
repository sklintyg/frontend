import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Box } from '@material-ui/core'

const useStyles = makeStyles({
  logo: {
    maxheight: 26,
    maxWidth: 121,
    margin: 20,
  },
  title: {
    backgroundColor: '#292f4f',
  },
})

interface AppHeaderTitleProp {
  imgSrc: string
}

const AppHeaderTitle: React.FC<AppHeaderTitleProp> = (props) => {
  const classes = useStyles()

  return (
    <Box className={classes.title}>
      <img src={props.imgSrc} alt="logo" className={classes.logo} />
    </Box>
  )
}

export default AppHeaderTitle
