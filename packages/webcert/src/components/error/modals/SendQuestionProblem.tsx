import React from 'react'
import WCDynamicLink from '../../utils/WCDynamicLink'
import { ModalProps } from './errorUtils'
import ErrorModalBase from './ErrorModalBase'

export const GENERAL_ERROR_TITLE = 'Meddelandet har inte skickats'

const GeneralErrorReload: React.FC<ModalProps> = ({ errorData }) => {
  return (
    <ErrorModalBase errorData={errorData}>
      <p>
        <strong>{GENERAL_ERROR_TITLE}</strong>
      </p>
      <p>Webcert saknar kontakt med Försäkringskassans datasystem. Prova igen om en stund.</p>
      <p>
        Om problemet kvarstår, kontakta i första hand din lokala IT-avdelning och i andra hand{' '}
        <WCDynamicLink linkKey={'ineraKundserviceAnmalFel'} />.
      </p>
      <p>Ange fel-id för snabbare hantering.</p>
    </ErrorModalBase>
  )
}

export default GeneralErrorReload
