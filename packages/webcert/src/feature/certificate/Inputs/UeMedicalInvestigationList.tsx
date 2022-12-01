import { CertificateDataElement, Accordion } from '@frontend/common'
import { ValueMedicalInvestigation, ConfigUeMedicalInvestigationList } from '@frontend/common/src/types/certificate'
import React from 'react'
import styled from 'styled-components/macro'
import { useAppDispatch } from '../../../store/store'
import UeMedicalInvestigation from './UeMedicalInvestigation'

const ValidationWrapper = styled.div`
  flex: 0 !important;
  flex-basis: 100% !important;
  padding-bottom: 16px;
  margin-top: 0;
`

export interface Props {
  disabled?: boolean
  question: CertificateDataElement
}

const UeMedicalInvestigationList: React.FC<Props> = ({ question, disabled }) => {
  const questionValue = question.value as ValueMedicalInvestigation
  const config = question.config as ConfigUeMedicalInvestigationList
  const dispatch = useAppDispatch()

  return (
    <>
      <div className="iu-grid-cols">
        <h4>{config.typeText}</h4>
        <h4>{config.dateText}</h4>
        <Accordion title={config.informationSourceText} titleId={''} description={config.informationSourceDescription} />
      </div>
      <div className="ic-forms__group iu-grid-rows">
        {config.list.map((listItem) => {
          console.log(questionValue)
          return <UeMedicalInvestigation question={question} config={listItem} questionId={question.id} value={questionValue} />
        })}
      </div>
    </>
  )
}

export default UeMedicalInvestigationList
