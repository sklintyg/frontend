import React from 'react'
import { AppHeaderItem } from '../index'

interface Props {
  text: string
  link: string
  withoutDivider?: boolean
}

const AppHeaderLink: React.FC<Props> = (props) => {
  let addedClass
  if (!props.withoutDivider) {
    addedClass = 'iu-link-divider-right'
  }
  return (
    <a href={props.link} className={`${addedClass} 'iu-color-main'`}>
      {props.text}
    </a>
  )
}

export default AppHeaderLink
