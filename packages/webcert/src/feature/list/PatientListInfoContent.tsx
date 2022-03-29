import * as React from 'react'
import { PatientListInfo } from '@frontend/common/src/types/list'
import { faExclamationTriangle, faInfoCircle, faUserShield } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styled from 'styled-components/macro'

const Wrapper = styled.div`
  display: flex;
  gap: 12px;
`

interface Props {
  info: PatientListInfo
}

const PatientListInfoContent: React.FC<Props> = ({ info }) => {
  return (
    <Wrapper>
      {info.id}
      <div>
        {info.protectedPerson && (
          <FontAwesomeIcon icon={faUserShield} className={'iu-color-information'} data-tip="Patienten har skyddade personuppgifter." />
        )}
        {info.testIndicated && (
          <FontAwesomeIcon icon={faInfoCircle} className={'iu-color-information'} data-tip="Patienten är en valideringsperson." />
        )}
        {info.deceased && (
          <FontAwesomeIcon icon={faExclamationTriangle} className={'iu-color-information'} data-tip="Patienten är avliden." />
        )}
      </div>
    </Wrapper>
  )
}

export default PatientListInfoContent
