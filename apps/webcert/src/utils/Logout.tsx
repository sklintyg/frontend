import type React from 'react'
import styled from 'styled-components'
import type { ResourceLink, User } from '../types'
import { LoginMethod } from '../types'
import { getCookie } from '@frontend/utils'
import { triggerFakeLogout } from '../store/user/userActions'
import { useAppDispatch } from '../store/store'

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

const Logout = ({ link, user }: Props) => {
  const dispatch = useAppDispatch()

  if (!link) {
    return null
  }

  const logout = () => {
    if (!user || user.loginMethod === LoginMethod.FAKE) {
      dispatch(triggerFakeLogout)
      window.open('/welcome', '_self')
    } else {
      triggerSamlLogout()
    }
  }

  const triggerSamlLogout = () => {
    const form = document.createElement('form')
    const input = document.createElement('input')
    form.method = 'POST'
    form.action = '/logout'
    input.type = 'hidden'
    input.name = '_csrf'
    input.value = getCookie('XSRF-TOKEN') ?? ''
    form.appendChild(input)
    document.body.appendChild(form)
    form.submit()
  }

  return (
    <StyledLink className="ic-link" onClick={logout}>
      {link.name}
    </StyledLink>
  )
}

export default Logout
