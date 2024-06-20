import { useState } from 'react'
import { useSelector } from 'react-redux'
import QuestionValidationTexts from '../../../../components/Validation/QuestionValidationTexts'
import { updateCertificateDataElement } from '../../../../store/certificate/certificateActions'
import { getVisibleValidationErrors } from '../../../../store/certificate/certificateSelectors'
import { useAppDispatch } from '../../../../store/store'
import {
  CertificateDataElement,
  ConfigUeMedicalInvestigationList,
  ValueMedicalInvestigation,
  ValueMedicalInvestigationList,
} from '../../../../types'
import { UeMedicalInvestigation } from './UeMedicalInvestigation'

export function UeMedicalInvestigationList({ question, disabled }: { disabled?: boolean; question: CertificateDataElement }) {
  const dispatch = useAppDispatch()
  const questionValue = question.value as ValueMedicalInvestigationList
  const questionConfig = question.config as ConfigUeMedicalInvestigationList
  const fields = questionConfig.list
    .map(({ investigationTypeId, dateId, informationSourceId }) => [investigationTypeId, dateId, informationSourceId])
    .flat()

  const validationErrors = useSelector(getVisibleValidationErrors(question.id))
  const [questionValueList, setQuestionValueList] = useState<ValueMedicalInvestigation[]>(questionValue.list)

  const handleChange = (index: number) => (value: ValueMedicalInvestigation) =>
    updateList(questionValueList.map((item, i) => (i === index ? value : item)))

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
      <div className="ic-forms__group iu-grid-rows">
        {questionConfig.list.map((config, index) => {
          const value = questionValueList[index]
          const itemValidationErrors = validationErrors.filter(({ field }) =>
            [config.investigationTypeId, config.dateId, config.informationSourceId].includes(field)
          )
          const emptyField = validationErrors.some((v) => v.field === 'underlag')
          return (
            value && (
              <UeMedicalInvestigation
                questionConfig={questionConfig}
                config={config}
                disabled={disabled}
                error={index === 0 && validationErrors.length === 1 && emptyField}
                key={index}
                onChange={handleChange(index)}
                validation={question.validation}
                validationErrors={itemValidationErrors}
                value={value}
              />
            )
          )
        })}
      </div>
      <QuestionValidationTexts validationErrors={validationErrors.filter(({ field }) => !fields.includes(field))} />
    </>
  )
}
