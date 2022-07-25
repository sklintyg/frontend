import React from 'react'
import { ResourceLink, User } from '@frontend/common'
import { LoginMethod } from '@frontend/common/src/types/user'

interface Props {
  link: ResourceLink
  user: User | null
}

const Logout: React.FC<Props> = ({ link, user }) => {
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
    <a target="_self" href={getLogoutPath()}>
      {link.name}
    </a>
  )
}

export default Logout
