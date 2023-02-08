import { LoginMethod, ResourceLink, User } from '@frontend/common'
import React from 'react'
import styled from 'styled-components'

const StyledLink = styled.a`
  text-align: center;
`

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
    <StyledLink target="_self" href={getLogoutPath()}>
      {link.name}
    </StyledLink>
  )
}

export default Logout
