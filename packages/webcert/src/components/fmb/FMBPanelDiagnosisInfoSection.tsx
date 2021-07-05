import { ExpandableText, FMBDiagnosisCodeInfoForm, FMBDiagnosisCodeInfoFormContentHeading } from '@frontend/common'
import React from 'react'
import styled from 'styled-components/macro'

const SubHeader = styled.p`
  font-size: 14px;
  font-weight: bold;
`

interface Props {
  header: string
  form?: FMBDiagnosisCodeInfoForm
  contentHeader?: FMBDiagnosisCodeInfoFormContentHeading
}

const FMBPanelDiagnosisInfoSection: React.FC<Props> = ({ header, form, contentHeader }) => {
  const maxTextLength = 250

  const getContent = (): string => {
    let text
    if (!contentHeader) {
      text = (form && form.content[0].text) ?? ''
    } else {
      text = form?.content.find((content) => content.heading === contentHeader)?.text
    }

    return text ?? ''
  }

  return (
    <div className="iu-p-500">
      <SubHeader>{header}</SubHeader>
      {form ? (
        <div>{<ExpandableText key={header} text={getContent()} maxLength={maxTextLength} />}</div>
      ) : (
        <div>
          <em>{'För den angivna diagnosen finns ingen FMB-information för ' + header}</em>
        </div>
      )}
    </div>
  )
}

export default FMBPanelDiagnosisInfoSection
