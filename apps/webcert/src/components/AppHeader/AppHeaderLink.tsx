import type React from 'react'
import { Link } from 'react-router-dom'

interface Props {
  text: string
  link: string
  withoutDivider?: boolean
  addedClass?: string
}

const AppHeaderLink: React.FC<Props> = (props) => {
  return (
    <Link to={props.link} className={`${props.addedClass} ${!props.withoutDivider && 'iu-link-divider-right'} iu-color-main`}>
      {props.text}
    </Link>
  )
}

export default AppHeaderLink
