import { CertificateDataElement } from '@frontend/common/src/types/certificate'
import * as React from 'react'
import styled, { css } from 'styled-components'
import { toNumber } from 'lodash'

const HeadlineStyles = css`
  margin-bottom: 0.625rem;
  :empty {
    display: none;
  }
`

const QuestionHeadline = styled.h4`
  ${HeadlineStyles}
`

const QuestionSubHeadline = styled.h5`
  ${HeadlineStyles}
`

interface QuestionHeadingProps {
  id: string
  hideLabel: boolean
  label?: string
  readOnly: boolean
  text: string
  question: CertificateDataElement
}

const QuestionHeading: React.FC<QuestionHeadingProps> = ({ question, readOnly, hideLabel, text, label }) => {
  const questionHaveSubQuestions = toNumber(question.parent)
  console.log(questionHaveSubQuestions)
  //console.log(question.parent)
  if (!questionHaveSubQuestions) {
    return (
      <QuestionHeadline id={question.id} className={`iu-fw-heading iu-fs-300 iu-pt-200`}>
        {text}
      </QuestionHeadline>
    )
  }
  return (
    <>
      <QuestionSubHeadline className={`iu-fw-heading iu-fs-200`}>{text}</QuestionSubHeadline>
      {readOnly && !hideLabel && <QuestionSubHeadline className={`iu-fw-heading iu-fs-200`}>{label}</QuestionSubHeadline>}
    </>
  )
}
export default QuestionHeading
