import { StatusWithIcon } from '@frontend/common'
import React from 'react'

const ComplementStatus: React.FC = () => {
  return (
    <StatusWithIcon icon={'ErrorOutlineIcon'} additionalTextStyles={'iu-color-error'}>
      Försäkringskassan har begärt komplettering
    </StatusWithIcon>
  )
}

export default ComplementStatus
