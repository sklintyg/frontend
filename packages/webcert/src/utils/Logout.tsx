import React from 'react'
import { Link } from 'react-router-dom'
import { ResourceLink, User } from '@frontend/common'
import { LoginMethod } from '@frontend/common/src/types/user'

interface Props {
  className: string
  link: ResourceLink
  user: User | null
}

const Logout: React.FC<Props> = ({ className, link, user }) => {
  if (!link) {
    return null
  }

  const getLogoutPath = () => {
    if (!user || user.loginMethod === LoginMethod.FAKE) {
      return '/logout'
    } else {
      return '/saml/logout'
    }
  }

  return (
    <Link to={{ pathname: getLogoutPath() }} className={className}>
      {link.name}
    </Link>
  )
}

export default Logout
