import React from 'react'
import { useDispatch } from 'react-redux'
import { triggerLogoutNow } from '../../store/user/userActions'
import { Link } from 'react-router-dom'
import { ResourceLink } from '@frontend/common'

interface Props {
  className: string
  link: ResourceLink
}

const Logout: React.FC<Props> = ({ className, link }) => {
  const dispatch = useDispatch()

  if (!link) {
    return null
  }

  const onClick = () => {
    dispatch(triggerLogoutNow)
  }

  return (
    <Link to={{ pathname: '/' }} onClick={onClick} className={className}>
      {link.name}
    </Link>
  )
}

export default Logout
