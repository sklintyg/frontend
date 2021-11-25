import { ModalProps } from './ModalUtils'
import React from 'react'
import ErrorModalBase from './ErrorModalBase'
import WCDynamicLink from '../../utils/WCDynamicLink'

const PU_PROBLEM_TITLE = 'Personuppgiftstjänsten svarar inte.'
const PU_PROBLEM_MESSAGE =
  'Åtgärden kan inte genomföras eftersom den kräver att personuppgifter kan hämtas från personuppgiftsregistret. Prova igen om en stund.'
const PU_PROBLEM_MESSAGE_2 = 'Om problemet kvarstår, kontakta i förstahand din lokala IT-avdelning och i andrahand '

const PuProblem: React.FC<ModalProps> = ({ errorData }) => {
  return (
    <ErrorModalBase errorData={errorData}>
      <p>
        <strong>{PU_PROBLEM_TITLE}</strong>
      </p>
      <p>{PU_PROBLEM_MESSAGE}</p>
      <p>
        {PU_PROBLEM_MESSAGE_2}
        <WCDynamicLink linkKey={'ineraKundserviceAnmalFel'} />.
      </p>
    </ErrorModalBase>
  )
}

export default PuProblem
