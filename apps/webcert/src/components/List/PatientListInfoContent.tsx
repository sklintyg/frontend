import { Tooltip, TooltipContent, TooltipTrigger } from '@frontend/components'
import styled from 'styled-components'
import alertImage from '../../images/alert.svg'
import lockClosed from '../../images/lock-closed.svg'
import warningImage from '../../images/warning.svg'
import type { PatientListInfo } from '../../types/list'
import { formatPersonId } from '../../utils/personIdValidatorUtils'

const Wrapper = styled.div`
  display: flex;
  gap: 12px;
`

const IconsWrapper = styled.div`
  display: flex;
  gap: 6px;
`

const Icon = styled.img`
  width: 14px;
`

interface Props {
  info: PatientListInfo
}

const PatientListInfoContent = ({ info }: Props) => {
  return (
    <Wrapper>
      {formatPersonId(info.id)}
      <IconsWrapper>
        {info.protectedPerson && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Icon src={lockClosed} tabIndex={0} alt="Symbol för att visa att patienten har skyddade personuppgifter." />
            </TooltipTrigger>
            <TooltipContent small>Patienten har skyddade personuppgifter.</TooltipContent>
          </Tooltip>
        )}
        {info.testIndicated && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Icon src={alertImage} tabIndex={0} alt="Symbol för att visa att patienten är en valideringsperson." />
            </TooltipTrigger>
            <TooltipContent small>Patienten är en valideringsperson.</TooltipContent>
          </Tooltip>
        )}
        {info.deceased && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Icon src={warningImage} tabIndex={0} alt="Symbol för att visa att patienten är avliden." />
            </TooltipTrigger>
            <TooltipContent small>Patienten är avliden.</TooltipContent>
          </Tooltip>
        )}
      </IconsWrapper>
    </Wrapper>
  )
}

export default PatientListInfoContent
