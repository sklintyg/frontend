import React from 'react'
import WCDynamicLink from '../../../utils/WCDynamicLink'
import CenteredImageWithContent from '../../image/CenteredImageWithContent'
import errorImage from '../../../images/fel-1.svg'
import styled from 'styled-components/macro'
import ErrorCopyText from '../ErrorCopyText'

export const TITLE = 'Ärenden kunde inte visas'
export const MESSAGE = 'Prova att ladda om sidan. Om problemet kvarstår, kontakta i första hand din lokala IT-avdelning och i andra hand'

const Wrapper = styled.div`
  background-color: white;
  height: 100%;
  text-align: center;
`

interface Props {
  errorId: string
}

const FetchQuestionsProblem: React.FC<Props> = ({ errorId }) => {
  if (!errorId) {
    return null
  }

  return (
    <Wrapper>
      <CenteredImageWithContent imgSrc={errorImage}>
        <h4>{TITLE}</h4>
        <p>
          {MESSAGE} <WCDynamicLink linkKey={'ineraKundserviceAnmalFel'} />.
        </p>
        <p>
          Ange fel-id för snabbare hantering. <ErrorCopyText errorId={errorId} />.
        </p>
      </CenteredImageWithContent>
    </Wrapper>
  )
}

export default FetchQuestionsProblem
