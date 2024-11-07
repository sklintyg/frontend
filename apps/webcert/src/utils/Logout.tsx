import type React from 'react'
import styled from 'styled-components'
import type { ResourceLink, User } from '../types'
import { LoginMethod } from '../types'
import { getCookie } from '@frontend/utils'

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

  const form = document.createElement('form')
  const input = document.createElement('input')

  const getLogoutPath = () => {
    if (!user || user.loginMethod === LoginMethod.FAKE) {
      return '/testability/logout'
    } else {
      return '/logout'
    }
  }

  return (
    <form action={getLogoutPath()} method="POST" id="logoutForm">
      <input type="hidden" name="_csrf" value={getCookie('XSRF-TOKEN')} />
      <StyledLink className="ic-link">{link.name}</StyledLink>
    </form>
  )
}

export default Logout
