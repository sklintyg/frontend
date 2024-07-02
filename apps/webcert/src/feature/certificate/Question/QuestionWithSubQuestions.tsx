import type React from 'react'
import styled, { css } from 'styled-components'
import { getComplementsForQuestions, getQuestion } from '../../../store/certificate/certificateSelectors'
import type { RootState } from '../../../store/store'
import { useAppSelector } from '../../../store/store'
import { CertificateDataElementStyleEnum } from '../../../types'
import Question from './Question'
import { QuestionComplements } from './QuestionComplements'
import QuestionWrapper from './QuestionWrapper'

interface HighlightedProps {
  highlight: boolean
}

const Highlighted = styled.div<HighlightedProps>`
  :not(:last-child) {
    margin-bottom: 0.625rem;
  }
  :empty {
    display: none;
  }
  ${({ highlight }) =>
    highlight &&
    css`
      border-radius: 0.1875px;
      outline: 1.5px solid #01a5a3;
      margin-top: 1.5px;
      padding: 0.3125rem 0.3125rem;
    `}
`

const QuestionWithMargin = styled(Question)`
  :not(:last-child) {
    padding-bottom: 0.9375rem;
  }
`

interface Props {
  questionIds: string[]
}

export const QuestionWithSubQuestions: React.FC<Props> = ({ questionIds }) => {
  const hasComplements = useAppSelector((state) => getComplementsForQuestions(questionIds)(state).length > 0)
  const hasParentQuestion = useAppSelector((state) => getQuestion(questionIds[0])(state)?.visible ?? false)
  const isParentHighlighted = useAppSelector(
    (state: RootState) => getQuestion(questionIds[0])(state)?.style === CertificateDataElementStyleEnum.HIGHLIGHTED
  )

  if (!hasParentQuestion) return null

  return (
    <Highlighted highlight={hasComplements} data-testid={hasComplements ? `${questionIds.toString()}-highlighted` : ''}>
      <QuestionWrapper highlighted={isParentHighlighted}>
        {questionIds.map((id) => (
          <QuestionWithMargin key={id} id={id} />
        ))}
        <QuestionComplements questionIds={questionIds} />
      </QuestionWrapper>
    </Highlighted>
  )
}
