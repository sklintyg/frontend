import React from 'react'
import WCDynamicLink from '../../../utils/WCDynamicLink'
import ReloadModal from './ReloadModal'
import { ModalProps } from './errorUtils'

export const GENERAL_ERROR_TITLE = 'Tekniskt fel'
export const GENERAL_ERROR_MESSAGE =
  'Prova att ladda om sidan. Om problemet kvarstår, kontakta i första hand din lokala IT-avdelning och i andra hand'

const GeneralErrorReload: React.FC<ModalProps> = ({ errorData }) => {
  return (
    <ReloadModal errorData={errorData}>
      <p>
        <strong>{GENERAL_ERROR_TITLE}</strong>
      </p>
      <p>
        {GENERAL_ERROR_MESSAGE} <WCDynamicLink linkKey={'ineraKundserviceAnmalFel'} />
      </p>
    </ReloadModal>
  )
}

export default GeneralErrorReload
