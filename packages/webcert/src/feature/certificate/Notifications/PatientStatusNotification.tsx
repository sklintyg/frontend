import * as React from 'react'
import { InfoBox } from '@frontend/common'

interface Props {
  status: boolean
  title: string
}

const PatientStatusNotification: React.FC<Props> = ({ status, title }) => {
  if (!status) return null

  return (
    <InfoBox type={'info'}>
      <p>{title}</p>
    </InfoBox>
  )
}

export default PatientStatusNotification
