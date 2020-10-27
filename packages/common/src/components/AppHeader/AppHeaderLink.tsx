import React from 'react'
import { AppHeaderItem } from '../index'
import { makeStyles, Typography } from '@material-ui/core'
import Link from '@material-ui/core/Link'

const useStyles = makeStyles((theme) => ({
  link: {
    textDecoration: 'underline',
    fontSize: theme.typography.pxToRem(14),
  },
}))

interface Props {
  text: string
  link: string
}

const AppHeaderLink: React.FC<Props> = (props) => {
  const classes = useStyles()

  return (
    <AppHeaderItem>
      <Typography>
        <Link className={classes.link} color={'inherit'} href={props.link}>
          {props.text}
        </Link>
      </Typography>
    </AppHeaderItem>
  )
}

export default AppHeaderLink
