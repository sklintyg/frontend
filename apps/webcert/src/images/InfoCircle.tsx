import * as React from 'react'

import styled from 'styled-components'
import info from '../images/info.svg'

const Logo = styled.img`
  height: 15px;
  width: 15px;
  display: inline;
`

interface Props {
  className?: string
  tooltip?: string
  tabIndex?: number
  testId?: string
}

const InfoCircle: React.FC<Props> = ({ className, tooltip, tabIndex, testId }) => {
  return <Logo src={info} alt="Informera" data-tip={tooltip} className={className} tabIndex={tabIndex} data-testid={testId} />
}

export default InfoCircle
