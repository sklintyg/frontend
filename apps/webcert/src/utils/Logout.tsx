import type React from 'react'
import styled from 'styled-components'
import type { ResourceLink, User} from '../types';
import { LoginMethod } from '../types'

const StyledLink = styled.button`
  text-align: center;
  background: none;
  border: none;
  font-size: inherit;
  line-height: inherit;
  font-family: inherit;
  text-decoration: none;
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
    <form action={getLogoutPath()} method="POST" id="logoutForm">
      <StyledLink className="ic-link">{link.name}</StyledLink>
    </form>
  )
}

export default Logout
