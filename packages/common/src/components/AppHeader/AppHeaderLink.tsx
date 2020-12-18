import React from 'react'
import { AppHeaderItem } from '../index'
import { Link } from 'react-router-dom'

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
    <Link to={props.link} className={`${addedClass} 'iu-color-main'`}>
      {props.text}
    </Link>
  )
}

export default AppHeaderLink
