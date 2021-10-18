import React from 'react'
import { AppHeaderItem } from '../index'
import { Link } from 'react-router-dom'

interface Props {
  text: string
  link: string
  withoutDivider?: boolean
  addedClass?: string
}

const AppHeaderLink: React.FC<Props> = (props) => {
  if (!props.withoutDivider) {
    props.addedClass += ' iu-link-divider-right'
  }
  return (
    <Link to={props.link} className={`${props.addedClass} iu-color-main`}>
      {props.text}
    </Link>
  )
}

export default AppHeaderLink
