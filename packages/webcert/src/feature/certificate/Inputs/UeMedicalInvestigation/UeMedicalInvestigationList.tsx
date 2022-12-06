import { CertificateDataElement, Accordion } from '@frontend/common'
import {
  ValueMedicalInvestigation,
  ConfigUeMedicalInvestigationList,
  ValueMedicalInvestigationList,
} from '@frontend/common/src/types/certificate'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { updateCertificateDataElement } from '../../../../store/certificate/certificateActions'
import { getShowValidationErrors, getVisibleValidationErrors } from '../../../../store/certificate/certificateSelectors'
import { useAppDispatch } from '../../../../store/store'
import UeMedicalInvestigation from './UeMedicalInvestigation'

export interface Props {
  disabled?: boolean
  question: CertificateDataElement
}

const UeMedicalInvestigationList: React.FC<Props> = ({ question, disabled }) => {
  const dispatch = useAppDispatch()

  const questionValue = question.value as ValueMedicalInvestigationList
  const questionConfig = question.config as ConfigUeMedicalInvestigationList

  const isShowValidationError = useSelector(getShowValidationErrors)
  const validationErrors = useSelector(getVisibleValidationErrors(question.id))
  const [questionValueList, setQuestionValueList] = useState<ValueMedicalInvestigation[]>(questionValue.list as ValueMedicalInvestigation[])

  const handleChange = (index: number) => (value: ValueMedicalInvestigation) => {
    updateList(questionValueList.map((item, i) => (i === index ? value : item)))
  }

  const updateList = (list: ValueMedicalInvestigation[]) => {
    setQuestionValueList(list)
    dispatch(
      updateCertificateDataElement({
        ...question,
        value: {
          ...questionValue,
          list,
        },
      })
    )
  }

  return (
    <>
      <div className="iu-grid-cols">
        <h4>{questionConfig.typeText}</h4>
        <h4>{questionConfig.dateText}</h4>
        <Accordion title={questionConfig.informationSourceText} titleId={''} description={questionConfig.informationSourceDescription} />
      </div>
      <div className="ic-forms__group iu-grid-rows">
        {questionConfig.list.map((config, index) => {
          const value = questionValue.list[index]
          return (
            value && (
              <UeMedicalInvestigation
                questionId={question.id}
                config={config}
                value={value}
                disabled={disabled}
                isShowValidationError={isShowValidationError}
                validation={question.validation}
                onChange={handleChange(index)}
                validationErrors={validationErrors.filter((v) =>
                  [config.typeId, config.dateId, config.informationSourceId].includes(v.field)
                )}
              />
            )
          )
        })}
      </div>
    </>
  )
}

export default UeMedicalInvestigationList
