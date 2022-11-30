import {
  CertificateDataElement,
  Dropdown,
  QuestionValidationTexts,
  ValueUncertainDate,
  TextInput,
  DatePickerCustom,
  getValidDate,
  Accordion,
} from '@frontend/common'
import {
  ValueMedicalInvestigation,
  ConfigUeCodeItem,
  ConfigUeMedicalInvestigationList,
  ValueCode,
  ValueDate,
} from '@frontend/common/src/types/certificate'
import { isValid } from 'date-fns'
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components/macro'
import { updateCertificateDataElement } from '../../../store/certificate/certificateActions'
import { getQuestionHasValidationError, getShowValidationErrors } from '../../../store/certificate/certificateSelectors'
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
  const isShowValidationError = useSelector(getShowValidationErrors)
  const questionValue = question.value as ValueMedicalInvestigation
  const config = question.config as ConfigUeMedicalInvestigationList
  const dispatch = useAppDispatch()
  const hasValidationError = useSelector(getQuestionHasValidationError(question.id))
  const typeOptions = config.typeOptions as ConfigUeCodeItem[]

  return (
    <>
      <div className="iu-grid-cols">
        <h4>{config.typeText}</h4>
        <h4>{config.dateText}</h4>
        <Accordion title={config.informationSourceText} titleId={''} description={config.informationSourceDescription} />
      </div>
      <div className="ic-forms__group iu-grid-cols">
        {config.list.map((listItem) => {
          console.log(listItem)
          return <UeMedicalInvestigation question={question} />
        })}
      </div>
    </>
  )
}

export default UeMedicalInvestigationList
