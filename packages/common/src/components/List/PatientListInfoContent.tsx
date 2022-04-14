import * as React from 'react'
import styled from 'styled-components'
import infoImage from '../../images/info-image.svg'
import alertImage from '../../images/alert-image.svg'
import lockClosed from '../../images/lock-closed.svg'
import { PatientListInfo } from '../../types/list'

const Icon = styled.img`
  width: 15px;
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
        {info.protectedPerson && true && (
          <Icon
            src={lockClosed}
            data-tip="Patienten har skyddade personuppgifter."
            alt="Symbol för att visa att patienten har skyddade personuppgifter."
          />
        )}
        {info.testIndicated && true && (
          <Icon
            src={infoImage}
            data-tip="Patienten är en valideringsperson."
            alt="Symbol för att visa att patienten är en valideringsperson."
          />
        )}
        {info.deceased && true && (
          <Icon src={alertImage} data-tip="Patienten är avliden." alt="Symbol för att visa att patienten är avliden." />
        )}
      </IconsWrapper>
    </Wrapper>
  )
}

export default PatientListInfoContent
