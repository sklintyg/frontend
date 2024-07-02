import type React from 'react'
import styled from 'styled-components'
import errorImage from '../../../images/fel-1.svg'
import WCDynamicLink from '../../../utils/WCDynamicLink'
import CenteredImageWithContent from '../../image/CenteredImageWithContent'
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
        <ErrorCopyText errorId={errorId} />
      </CenteredImageWithContent>
    </Wrapper>
  )
}

export default FetchQuestionsProblem
