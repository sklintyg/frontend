import * as React from 'react'
import { faUserShield } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styled from 'styled-components/macro'
import infoImage from '../../images/info-image.svg'
import alertImage from '../../images/alert-image.svg'
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
          <FontAwesomeIcon
            icon={faUserShield}
            data-tip="Patienten har skyddade personuppgifter."
            aria-label="Symbol för att visa att patienten har skyddade personuppgifter."
          />
        )}
        {info.testIndicated && true && (
          <Icon
            src={infoImage}
            alt="userImage"
            data-tip="Patienten är en valideringsperson."
            aria-label="Symbol för att visa att patienten är en valideringsperson."
          />
        )}
        {info.deceased && true && (
          <Icon src={alertImage} data-tip="Patienten är avliden." aria-label="Symbol för att visa att patienten är avliden" />
        )}
      </IconsWrapper>
    </Wrapper>
  )
}

export default PatientListInfoContent
