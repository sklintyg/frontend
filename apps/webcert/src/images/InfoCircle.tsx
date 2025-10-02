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

const InfoCircle = ({ className, tooltip, tabIndex, testId }: Props) => {
  return (
    <Logo
      src={info}
      alt="Informera"
      data-tooltip-id="tooltip"
      data-tooltip-content={tooltip}
      className={className}
      tabIndex={tabIndex}
      data-testid={testId}
    />
  )
}

export default InfoCircle
