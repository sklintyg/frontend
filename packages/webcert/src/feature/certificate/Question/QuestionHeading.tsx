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
  hideLabel: boolean
  label?: string
  readOnly: boolean
  question: CertificateDataElement
  header?: string
  text: string
}

const QuestionHeading: React.FC<QuestionHeadingProps> = ({ question, readOnly, hideLabel, label, header, text }) => {
  const subQuestions = toNumber(question.parent)
  if (header) {
    return (
      <>
        <QuestionHeadline id={question.id} className={`iu-fw-heading iu-fs-300 iu-mb-200`}>
          {header}
        </QuestionHeadline>
        <QuestionSubHeadline className={`iu-fw-heading iu-fs-200`}>{text}</QuestionSubHeadline>
        {readOnly && !hideLabel && <QuestionSubHeadline className={`iu-fw-heading iu-fs-200`}>{label}</QuestionSubHeadline>}
      </>
    )
  }
  if (!subQuestions) {
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
