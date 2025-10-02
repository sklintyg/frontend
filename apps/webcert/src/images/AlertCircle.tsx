import styled from 'styled-components'
import infoCircle from '../images/alert.svg'

const Logo = styled.img`
  height: 15px;
  width: 15px;
`

const AlertCircle = () => {
  return <Logo src={infoCircle} alt="Uppmärksamma" />
}

export default AlertCircle
