import {
  CertificateDataElement,
  Dropdown,
  DatePickerCustom,
  ConfigureUeCauseOfDeath,
  QuestionValidationTexts,
  ValueCauseOfDeath,
  TextInput,
} from '@frontend/common'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components/macro'
import { updateCertificateDataElement } from '../../../store/certificate/certificateActions'
import { getQuestionHasValidationError, getShowValidationErrors } from '../../../store/certificate/certificateSelectors'
import { useAppDispatch } from '../../../store/store'

export interface Props {
  disabled?: boolean
  question: CertificateDataElement
}

const UeCauseOfDeath: React.FC<Props> = ({ question, disabled }) => {
  const isShowValidationError = useSelector(getShowValidationErrors)
  const config = question.config as ConfigureUeCauseOfDeath
  const dispatch = useAppDispatch()
  const hasValidationError = useSelector(getQuestionHasValidationError(question.id))
  const [selectedSpec, setSelectedSpec] = useState((question.value as ValueCauseOfDeath).specification)

  return (
    <div className="ic-forms__group iu-grid-cols">
      {config.title}
      <div>
        <div className="iu-fl iu-fs-600 iu-color-cta-text">{config.label}</div>
        <div>
          <TextInput label="Beskrivning" id={'description_' + question.id}></TextInput>
          <DatePickerCustom label="Ungefärlig debut" forbidFutureDates={true} inputString="" id={'debut_' + question.id}></DatePickerCustom>
          <Dropdown
            label="Specificera tillståndet"
            id={'specification_' + question.id}
            onChange={(event) => setSelectedSpec(event.currentTarget.value)}
            value={selectedSpec}
            options={config.specifications.map((item) => (
              <option value={item.id}>{item.label}</option>
            ))}></Dropdown>
        </div>
      </div>
    </div>
  )
}

export default UeCauseOfDeath
