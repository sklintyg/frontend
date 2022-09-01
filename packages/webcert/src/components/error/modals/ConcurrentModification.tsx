import React from 'react'
import WCDynamicLink from '../../../utils/WCDynamicLink'
import { ModalProps } from './errorUtils'
import ReloadModal from './ReloadModal'

export const CONCURRENT_MODIFICATION_ERROR_TITLE = 'Tekniskt fel'
export const CONCURRENT_MODIFICATION_ERROR_MESSAGE =
  'Prova att ladda om sidan. Om problemet kvarstår, kontakta i första hand din lokala IT-avdelning och i andra hand'

const ConcurrentModification: React.FC<ModalProps> = ({ errorData }) => {
  return (
    <ReloadModal errorData={errorData}>
      <p>
        <strong>{CONCURRENT_MODIFICATION_ERROR_TITLE}</strong>
      </p>
      <p>
        {CONCURRENT_MODIFICATION_ERROR_MESSAGE} <WCDynamicLink linkKey={'ineraKundserviceAnmalFel'} />
      </p>
    </ReloadModal>
  )
}

export default ConcurrentModification
