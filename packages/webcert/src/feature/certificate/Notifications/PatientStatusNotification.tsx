import * as React from 'react'
import { InfoBox } from '@frontend/common'
import styled from 'styled-components'

interface Props {
  status: boolean
  title: string
  type: 'info' | 'error' | 'success' | 'observe'
}
const Wrapper = styled.div`
  width: fit-content;
  margin-right: 10px;
`

const PatientStatusNotification: React.FC<Props> = ({ status, title, type }) => {
  if (!status) return null

  return (
    <Wrapper>
      <InfoBox type={type}>
        <p>{title}</p>
      </InfoBox>
    </Wrapper>
  )
}

export default PatientStatusNotification
