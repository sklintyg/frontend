import { Tooltip, TooltipContent, TooltipTrigger } from '@frontend/components'
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
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Logo src={check} tabIndex={0} alt="Check" className={className} />
      </TooltipTrigger>
      <TooltipContent small>{tooltip}</TooltipContent>
    </Tooltip>
  )
}

export default CheckIcon
