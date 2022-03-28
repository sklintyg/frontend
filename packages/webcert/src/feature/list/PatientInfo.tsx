import * as React from 'react'
import { PatientListInfo } from '@frontend/common/src/types/list'
import { faExclamationTriangle, faInfoCircle, faUserShield } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styled from 'styled-components/macro'

const Wrapper = styled.div`
  flex: no-wrap;
`

interface Props {
  info: PatientListInfo
}

const PatientInfo: React.FC<Props> = ({ info }) => {
  return (
    <Wrapper>
      {info.id}
      <div>
        {info.protectedPerson && <FontAwesomeIcon icon={faUserShield} />}
        {info.deceased && <FontAwesomeIcon icon={faExclamationTriangle} />}
        {info.testIndicated && <FontAwesomeIcon icon={faInfoCircle} />}
      </div>
    </Wrapper>
  )
}

export default PatientInfo
