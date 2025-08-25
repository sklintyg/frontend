import styled, { css } from 'styled-components'
import { getQuestion } from '../../../store/certificate/certificateSelectors'
import { useAppSelector } from '../../../store/store'
import type { CertificateDataElement } from '../../../types'
import { ConfigTypes } from '../../../types'

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

export function QuestionHeading({ question: { id, parent, config, readOnly } }: { question: CertificateDataElement }) {
  const questionParent = useAppSelector(getQuestion(parent))
  const questionTypeIsCategory = questionParent && questionParent.config.type === ConfigTypes.CATEGORY
  const hideLabel = config.type === ConfigTypes.UE_CAUSE_OF_DEATH

  return config.header ? (
    <>
      <QuestionHeadline id={id} className={`iu-fw-heading iu-fs-300 iu-mb-200`}>
        {config.header}
      </QuestionHeadline>
      <QuestionSubHeadline className={`iu-fw-heading iu-fs-200`}>{config.text}</QuestionSubHeadline>
      {readOnly && !hideLabel && <QuestionSubHeadline className={`iu-fw-heading iu-fs-200`}>{config.label}</QuestionSubHeadline>}
    </>
  ) : questionTypeIsCategory ? (
    <>
      {config.text && (
        <QuestionHeadline id={id} className={`iu-fw-heading iu-fs-300`}>
          {config.text}
        </QuestionHeadline>
      )}
      {readOnly && !hideLabel && (
        <QuestionHeadline id={id} className={`iu-fw-heading iu-fs-300`}>
          {config.label}
        </QuestionHeadline>
      )}
    </>
  ) : (
    <>
      {config.text && <QuestionSubHeadline className={`iu-fw-heading iu-fs-200`}>{config.text}</QuestionSubHeadline>}
      {readOnly && !hideLabel && <QuestionSubHeadline className={`iu-fw-heading iu-fs-200`}>{config.label}</QuestionSubHeadline>}
    </>
  )
}
