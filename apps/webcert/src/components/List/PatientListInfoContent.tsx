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

const PatientListInfoContent: React.FC<Props> = ({ info }) => {
  return (
    <Wrapper>
      {formatPersonId(info.id)}
      <IconsWrapper>
        {info.protectedPerson && (
          <Icon
            src={lockClosed}
            data-tip="Patienten har skyddade personuppgifter."
            alt="Symbol för att visa att patienten har skyddade personuppgifter."
          />
        )}
        {info.testIndicated && (
          <Icon
            src={alertImage}
            data-tip="Patienten är en valideringsperson."
            alt="Symbol för att visa att patienten är en valideringsperson."
          />
        )}
        {info.deceased && <Icon src={warningImage} data-tip="Patienten är avliden." alt="Symbol för att visa att patienten är avliden." />}
      </IconsWrapper>
    </Wrapper>
  )
}

export default PatientListInfoContent
