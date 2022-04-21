import * as React from 'react'
import styled from 'styled-components'
import alertImage from '../../images/alert-image.svg'
import warningImage from '../../images/warning-image.svg'
import lockClosed from '../../images/lock-closed.svg'
import { PatientListInfo } from '../../types/list'

const Icon = styled.img`
  width: 14px;
`

const Wrapper = styled.div`
  display: flex;
  gap: 12px;
`

const IconsWrapper = styled.div`
  display: flex;
  gap: 6px;
`

interface Props {
  info: PatientListInfo
}

const PatientListInfoContent: React.FC<Props> = ({ info }) => {
  return (
    <Wrapper>
      {info.id}
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
