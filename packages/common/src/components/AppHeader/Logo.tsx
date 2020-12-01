import React from 'react'
import { makeStyles, Box } from '@material-ui/core'

const useStyles = makeStyles({
  logo: {
    maxWidth: 121,
    margin: 20,
    objectFit: 'cover',
  },
  title: {
    backgroundColor: '#292f4f',
    display: 'flex',
  },
})

interface Props {
  imgSrc: string
  imgAlt?: string
  additionalImgStyles?: string
  additionalWrapperStyles?: string
}

const Logo: React.FC<Props> = ({ imgSrc, imgAlt, additionalImgStyles, additionalWrapperStyles }) => {
  const classes = useStyles()

  return (
    <Box className={`${classes.title} ${additionalWrapperStyles}`}>
      <img src={imgSrc} alt={imgAlt} className={`${classes.logo} ${additionalImgStyles}`} />
    </Box>
  )
}

export default Logo
