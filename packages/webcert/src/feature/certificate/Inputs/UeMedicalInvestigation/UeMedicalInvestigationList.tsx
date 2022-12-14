import { CertificateDataElement, Accordion, AccordionHeader, Text, sanitizeText, getValidDate, formatDateToString } from '@frontend/common'
import {
  ValueMedicalInvestigation,
  ConfigUeMedicalInvestigationList,
  ValueMedicalInvestigationList,
} from '@frontend/common/src/types/certificate'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { updateCertificateDataElement } from '../../../../store/certificate/certificateActions'
import { getVisibleValidationErrors } from '../../../../store/certificate/certificateSelectors'
import { useAppDispatch } from '../../../../store/store'
import UeMedicalInvestigation from './UeMedicalInvestigation'
import { isValid } from 'date-fns'

export interface Props {
  disabled?: boolean
  question: CertificateDataElement
}

const UeMedicalInvestigationList: React.FC<Props> = ({ question, disabled }) => {
  const dispatch = useAppDispatch()

  const questionValue = question.value as ValueMedicalInvestigationList
  const questionConfig = question.config as ConfigUeMedicalInvestigationList

  const validationErrors = useSelector(getVisibleValidationErrors(question.id))
  const [questionValueList, setQuestionValueList] = useState<ValueMedicalInvestigation[]>(questionValue.list)

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
          list: list.map(({ date, ...val }) => {
            const validDate = getValidDate(date.date)
            return {
              ...val,
              date: {
                ...date,
                date: validDate && isValid(validDate) ? formatDateToString(validDate) : '',
              },
            }
          }),
        },
      })
    )
  }

  return (
    <>
      <div className="iu-grid-cols">
        <h4>{questionConfig.typeText}</h4>
        <h4>{questionConfig.dateText}</h4>
        <Accordion>
          <AccordionHeader>
            <h4 className={'iu-fs-300'}>{questionConfig.informationSourceText}</h4>
          </AccordionHeader>
          <Text className={'iu-mb-400'} dangerouslySetInnerHTML={sanitizeText(questionConfig.informationSourceDescription)}></Text>
        </Accordion>
      </div>
      <div className="ic-forms__group iu-grid-rows">
        {questionConfig.list.map((config, index) => {
          const value = questionValueList[index]
          return (
            value && (
              <UeMedicalInvestigation
                questionId={question.id}
                config={config}
                value={value}
                disabled={disabled}
                key={index}
                isShowValidationError={validationErrors.length > 0}
                validation={question.validation}
                onChange={handleChange(index)}
                validationErrors={validationErrors.filter((v) =>
                  [config.investigationTypeId, config.dateId, config.informationSourceId].includes(v.field)
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
