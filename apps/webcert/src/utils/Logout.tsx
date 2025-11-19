import styled from 'styled-components'
import { useLogout } from '../hooks/useLogout'

const StyledLink = styled.button`
  text-align: center;
  background: none;
  border: none;
  font-size: inherit;
  line-height: inherit;
  font-family: inherit;
  text-decoration: none;
`

const Logout = () => {
  const result = useLogout()

  if (!result) {
    return null
  }

  const { logout, link } = result

  return (
    <StyledLink className="ic-link" onClick={logout}>
      {link.name}
    </StyledLink>
  )
}

export default Logout
