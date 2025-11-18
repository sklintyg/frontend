import { Tooltip, TooltipContent, TooltipTrigger } from '@frontend/components'
import styled from 'styled-components'
import list from '../images/list.svg'

const Logo = styled.img`
  height: 15px;
  width: 15px;
  display: inline;
`

interface Props {
  className?: string
  tooltip?: string
}

const ListIcon = ({ className, tooltip }: Props) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Logo src={list} tabIndex={0} alt="List" className={className} />
      </TooltipTrigger>
      <TooltipContent small>{tooltip}</TooltipContent>
    </Tooltip>
  )
}

export default ListIcon
