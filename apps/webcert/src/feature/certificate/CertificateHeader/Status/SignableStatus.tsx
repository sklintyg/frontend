import type React from 'react'
import StatusWithIcon from '../../../../components/utils/StatusWithIcon'

interface Props {
  isValidForSigning: boolean
}

const SignableStatus: React.FC<Props> = ({ isValidForSigning }) => {
  return (
    <StatusWithIcon
      icon={isValidForSigning ? 'CheckIcon' : 'ErrorOutlineIcon'}
      additionalTextStyles={!isValidForSigning ? 'iu-color-error' : ''}
    >
      {isValidForSigning ? 'Klart att signera' : 'Obligatoriska uppgifter saknas'}
    </StatusWithIcon>
  )
}

export default SignableStatus
