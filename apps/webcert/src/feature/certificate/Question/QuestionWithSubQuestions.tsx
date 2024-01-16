import { isEqual } from 'lodash'
import React from 'react'
import { useSelector } from 'react-redux'
import styled, { css } from 'styled-components'
import { getComplementsForQuestions, getQuestion } from '../../../store/certificate/certificateSelectors'
import Question from './Question'
import QuestionWrapper from './QuestionWrapper'
import { CertificateDataElementStyleEnum } from '../../../types'

interface HighlightedProps {
  highlight: boolean
}

export const Highlighted = styled.div<HighlightedProps>`
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

export const Complement = styled.div`
  display: flex;
  align-items: top;
  justify-content: space-between;
  padding: 5px;
`

export const ComplementMessage = styled.div`
  white-space: pre-line;
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
  const complements = useSelector(getComplementsForQuestions(questionIds), isEqual)
  const parentQuestion = useSelector(getQuestion(questionIds[0]), isEqual)

  if (!parentQuestion || !parentQuestion.visible) return null

  return parentQuestion.visible ? (
    <Highlighted highlight={complements.length > 0}>
      <QuestionWrapper highlighted={parentQuestion.style === CertificateDataElementStyleEnum.HIGHLIGHTED}>
        {questionIds.map((id) => (
          <QuestionWithMargin key={id} id={id} />
        ))}
        {complements.map((complement, index) => (
          <div key={index} className="ic-alert ic-alert--status ic-alert--info iu-p-none iu-my-400">
            <Complement>
              <i className="ic-alert__icon ic-info-icon iu-m-none" />
              <div className="iu-fullwidth iu-pl-300 iu-fs-200">
                <p className="iu-fw-heading">Kompletteringsbegäran:</p>
                <ComplementMessage>{complement.message}</ComplementMessage>
              </div>
            </Complement>
          </div>
        ))}
      </QuestionWrapper>
    </Highlighted>
  ) : null
}
