import React from 'react'
import { AppHeaderItem } from '../index'
import { Typography } from '@material-ui/core'
import Link from '@material-ui/core/Link'

interface AppHeaderAboutProps {
  text: string
  link: string
}

const AppHeaderAbout: React.FC<AppHeaderAboutProps> = (props) => {
  return (
    <AppHeaderItem>
      <Typography>
        <Link color={'inherit'} href={props.link}>
          {props.text}
        </Link>
      </Typography>
    </AppHeaderItem>
  )
}

export default AppHeaderAbout
