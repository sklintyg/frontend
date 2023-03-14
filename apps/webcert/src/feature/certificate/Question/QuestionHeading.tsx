import { ConfigTypes } from '@frontend/common'
import * as React from 'react'
import { useSelector } from 'react-redux'
import styled, { css } from 'styled-components'
import { getQuestion } from '../../../store/certificate/certificateSelectors'

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
  header?: string
  questionId: string
  hideLabel: boolean
  label?: string
  readOnly: boolean
  text: string
  questionParent: string
}

const QuestionHeading: React.FC<QuestionHeadingProps> = ({ readOnly, header, questionId, hideLabel, text, label, questionParent }) => {
  const parent = useSelector(getQuestion(questionParent))
  const questionTypeIsCategory = parent && parent.config.type === ConfigTypes.CATEGORY

  return header ? (
    <>
      <QuestionHeadline id={questionId} className={`iu-fw-heading iu-fs-300 iu-mb-200`}>
        {header}
      </QuestionHeadline>
      <QuestionSubHeadline className={`iu-fw-heading iu-fs-200`}>{text}</QuestionSubHeadline>
      {readOnly && !hideLabel && <QuestionSubHeadline className={`iu-fw-heading iu-fs-200`}>{label}</QuestionSubHeadline>}
    </>
  ) : questionTypeIsCategory ? (
    <>
      <QuestionHeadline id={questionId} className={`iu-fw-heading iu-fs-300`}>
        {text}
      </QuestionHeadline>
      {readOnly && !hideLabel && (
        <QuestionHeadline id={questionId} className={`iu-fw-heading iu-fs-300`}>
          {label}
        </QuestionHeadline>
      )}
    </>
  ) : (
    <>
      <QuestionSubHeadline className={`iu-fw-heading iu-fs-200`}>{text}</QuestionSubHeadline>
      {readOnly && !hideLabel && <QuestionSubHeadline className={`iu-fw-heading iu-fs-200`}>{label}</QuestionSubHeadline>}
    </>
  )
}

export default QuestionHeading
