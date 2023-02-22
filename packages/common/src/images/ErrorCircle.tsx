import * as React from 'react'

import styled from 'styled-components'
import infoCircle from '../images/error.svg'

const Logo = styled.img`
  height: 15px;
  width: 15px;
`

const ErrorCircle: React.FC = () => {
  return <Logo src={infoCircle} alt="Uppmärksamma" />
}

export default ErrorCircle
