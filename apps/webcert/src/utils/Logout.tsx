import type React from 'react'
import styled from 'styled-components'
import type { ResourceLink, User } from '../types'
import { LoginMethod } from '../types'
import { getCookie } from '@frontend/utils'
import { useHistory, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'

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
  const history = useHistory()
  const dispatch = useDispatch()
  const location = useLocation()

  if (!link) {
    return null
  }

  const form = document.createElement('form')
  const input = document.createElement('input')

  const logout = () => {
    if (!user || user.loginMethod === LoginMethod.FAKE) {
      postLogout('/testability/logout')
    } else {
      postLogout('/logout')
    }
  }

  const getLogoutPath = () => {
    return !user || user.loginMethod === LoginMethod.FAKE ? '/testability/logout' : '/logout'
  }

  const postLogout = (logoutPath: string) => {
    const form = document.createElement('form')
    const input = document.createElement('input')
    form.method = 'POST'
    form.action = logoutPath
    form.id = 'logoutForm'
    input.type = 'hidden'
    input.name = '_csrf'
    input.value = getCookie('XSRF-TOKEN') ?? ''
    form.appendChild(input)
    document.body.appendChild(form)
    form.submit()
  }

  const navigate = () => {
    if (!user || user.loginMethod === LoginMethod.FAKE) {
      window.open('/welcome', '_self')
      //history.replace('/welcome')
      //history.replace('/welcome')
    }
  }

  return (
    <StyledLink className="ic-link" onClick={logout}>
      {link.name}
    </StyledLink>
  )

  // return (
  //   <form action={getLogoutPath()} method="POST" id="logoutForm" onSubmit={navigate}>
  //     <input type="hidden" name="_csrf" value={getCookie('XSRF-TOKEN')} />
  //     <StyledLink className="ic-link" onClick={logout}>
  //       {link.name}
  //     </StyledLink>
  //   </form>
  // )
}

export default Logout
