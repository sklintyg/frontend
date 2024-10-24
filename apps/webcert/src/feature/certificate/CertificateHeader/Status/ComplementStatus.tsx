import type React from 'react'
import StatusWithIcon from '../../../../components/utils/StatusWithIcon'

const ComplementStatus: React.FC = () => {
  return (
    <StatusWithIcon icon={'ErrorOutlineIcon'} additionalTextStyles={'iu-color-error'}>
      Försäkringskassan har begärt komplettering
    </StatusWithIcon>
  )
}

export default ComplementStatus
