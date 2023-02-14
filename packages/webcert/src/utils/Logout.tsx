import { LoginMethod, ResourceLink, User } from '@frontend/common'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

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
  const [logout, setLogout] = useState(false)

  useEffect(() => {
    if (logout) {
      ;(document.getElementById('logoutForm') as HTMLFormElement)?.submit()
      setLogout(false)
    }
  }, [logout])

  if (!link) {
    return null
  }

  const submitLogOut = () => {
    setLogout(true)
  }

  const getLogoutPath = () => {
    if (!user || user.loginMethod === LoginMethod.FAKE) {
      return '/logout'
    } else {
      return '/saml/logout'
    }
  }

  return (
    <>
      <StyledLink onClick={submitLogOut} className="ic-link">
        {link.name}
      </StyledLink>
      {logout && <form action={getLogoutPath()} method="POST" id="logoutForm" />}
    </>
  )
}

export default Logout
