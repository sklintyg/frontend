import { Tooltip, TooltipContent, TooltipTrigger } from '@frontend/components'
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
    <Tooltip>
      <TooltipTrigger asChild>
        <Logo src={info} alt="Informera" className={className} tabIndex={tabIndex} data-testid={testId} />
      </TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  )
}

export default InfoCircle
