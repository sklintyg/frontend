import * as React from 'react'

import styled from 'styled-components'
import infoCircle from '@frontend/common/src/images/alert-image.svg'

const Logo = styled.img`
  height: 15px;
  width: 15px;
`

const AlertCircle: React.FC = () => {
  return <Logo src={infoCircle} alt="Uppmärksamma" />
}

export default AlertCircle
