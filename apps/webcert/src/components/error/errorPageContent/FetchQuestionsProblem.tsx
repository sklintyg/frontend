import styled from 'styled-components'
import errorImage from '../../../images/fel-1.svg'
import CenteredImageWithContent from '../../image/CenteredImageWithContent'
import { ContactSupportMessage } from '../ContactSupportMessage'
import ErrorCopyText from '../ErrorCopyText'

const Wrapper = styled.div`
  background-color: white;
  height: 100%;
  text-align: center;
`

export function FetchQuestionsProblem({ errorId }: { errorId: string }) {
  if (!errorId) {
    return null
  }

  return (
    <Wrapper>
      <CenteredImageWithContent imgSrc={errorImage}>
        <h4>Ärenden kunde inte visas</h4>
        <p>
          Prova att ladda om sidan. <ContactSupportMessage />.
        </p>
        <ErrorCopyText errorId={errorId} />
      </CenteredImageWithContent>
    </Wrapper>
  )
}
