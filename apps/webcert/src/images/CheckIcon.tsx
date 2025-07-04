import styled from 'styled-components'
import check from '../images/check.svg'

const Logo = styled.img`
  height: 15px;
  width: 15px;
  display: inline;
`

interface Props {
  className?: string
  tooltip?: string
}

const CheckIcon = ({ className, tooltip }: Props) => {
  return <Logo src={check} alt="Check" data-tip={tooltip} className={className} />
}

export default CheckIcon
