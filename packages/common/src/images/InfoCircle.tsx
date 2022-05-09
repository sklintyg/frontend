import * as React from 'react'

import styled from 'styled-components'
import info from '@frontend/common/src/images/info.svg'

const Logo = styled.img`
  height: 15px;
  width: 15px;
  display: inline;
`

interface Props {
  className?: string
  tooltip?: string
}

const InfoCircle: React.FC<Props> = ({ className, tooltip }) => {
  return <Logo src={info} alt="Logo Informera" data-tip={tooltip} className={className} />
}

export default InfoCircle
