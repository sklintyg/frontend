import React from 'react'
import { AppHeaderItem } from '../index'

interface Props {
  text: string
  link: string
}

const AppHeaderLink: React.FC<Props> = (props) => {
  return (
    <AppHeaderItem>
      <p>
        <a color={'inherit'} href={props.link}>
          {props.text}
        </a>
      </p>
    </AppHeaderItem>
  )
}

export default AppHeaderLink
