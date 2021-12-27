import { StatusWithIcon } from '@frontend/common'
import React from 'react'

interface Props {
  isValidForSigning: boolean
}

const SignableStatus: React.FC<Props> = ({ isValidForSigning }) => {
  return (
    <StatusWithIcon icon={isValidForSigning ? 'CheckIcon' : 'ErrorOutlineIcon'}>
      {isValidForSigning ? 'Klart att signera' : 'Obligatoriska uppgifter saknas'}
    </StatusWithIcon>
  )
}

export default SignableStatus
