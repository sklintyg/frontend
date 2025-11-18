import { Tooltip, TooltipContent, TooltipTrigger } from '@frontend/components'
import styled from 'styled-components'
import id_card from '../images/id_card.svg'

const Logo = styled.img`
  height: 15px;
  width: 15px;
  display: inline;
`

interface Props {
  className?: string
  tooltip?: string
}

const IdCardIcon = ({ className, tooltip }: Props) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Logo src={id_card} tabIndex={0} alt="Id-Card" className={className} />
      </TooltipTrigger>
      <TooltipContent small>{tooltip}</TooltipContent>
    </Tooltip>
  )
}

export default IdCardIcon
