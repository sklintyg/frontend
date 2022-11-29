import * as React from 'react'
import styled, { css } from 'styled-components'

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
  id: string
  hideLabel: boolean
  label?: string
  readOnly: boolean
  text: string
}

const QuestionHeading: React.FC<QuestionHeadingProps> = ({ readOnly, header, id, hideLabel, text, label }) => {
  if (header) {
    return (
      <>
        <QuestionHeadline id={id} className={`iu-fw-heading iu-fs-300 iu-mb-200`}>
          {header}
        </QuestionHeadline>
        <QuestionSubHeadline className={`iu-fw-heading iu-fs-200`}>{text}</QuestionSubHeadline>
        {readOnly && !hideLabel && <QuestionSubHeadline className={`iu-fw-heading iu-fs-200`}>{label}</QuestionSubHeadline>}
      </>
    )
  }
  return (
    <>
      <QuestionHeadline id={id} className={`iu-fw-heading iu-fs-300`}>
        {text}
      </QuestionHeadline>
      {readOnly && !hideLabel && (
        <QuestionHeadline id={id} className={`iu-fw-heading iu-fs-300`}>
          {label}
        </QuestionHeadline>
      )}
    </>
  )
}

export default QuestionHeading
