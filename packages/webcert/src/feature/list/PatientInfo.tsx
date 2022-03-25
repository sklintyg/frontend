import * as React from 'react'
import { PatientListInfo } from '@frontend/common/src/types/list'

interface Props {
  info: PatientListInfo
}

const PatientInfo: React.FC<Props> = ({ info }) => {
  return <>{info.id}</>
}

export default PatientInfo
