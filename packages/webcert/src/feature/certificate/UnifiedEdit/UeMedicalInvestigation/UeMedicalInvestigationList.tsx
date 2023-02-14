import {
  Accordion,
  AccordionHeader,
  CertificateDataElement,
  ConfigUeMedicalInvestigationList,
  QuestionValidationTexts,
  sanitizeText,
  Text,
  ValueMedicalInvestigation,
  ValueMedicalInvestigationList,
} from '@frontend/common'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { updateCertificateDataElement } from '../../../../store/certificate/certificateActions'
import { getVisibleValidationErrors } from '../../../../store/certificate/certificateSelectors'
import { useAppDispatch } from '../../../../store/store'
import UeMedicalInvestigation from './UeMedicalInvestigation'
import { UeMedicalInvestigationGrid } from './UeMedicalInvestigationGrid'

export interface Props {
  disabled?: boolean
  question: CertificateDataElement
}

const StyledAccordionHeader = styled(AccordionHeader)`
  padding: 0 !important;
  margin: 0 !important;
  padding-right: 1.625rem !important;

  &:after {
    right: 0 !important;
  }
`

const UeMedicalInvestigationList: React.FC<Props> = ({ question, disabled }) => {
  const dispatch = useAppDispatch()
  const fieldIfEmptyFirstRow = 'underlag'
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
      <UeMedicalInvestigationGrid>
        <h4>{questionConfig.typeText}</h4>
        <h4>{questionConfig.dateText}</h4>
        <Accordion>
          <StyledAccordionHeader>
            <h4 className={'iu-fs-300'}>{questionConfig.informationSourceText}</h4>
          </StyledAccordionHeader>
          <Text className={'iu-mb-400'} dangerouslySetInnerHTML={sanitizeText(questionConfig.informationSourceDescription)}></Text>
        </Accordion>
      </UeMedicalInvestigationGrid>
      <div className="ic-forms__group iu-grid-rows">
        {questionConfig.list.map((config, index) => {
          const value = questionValueList[index]
          const itemValidationErrors = validationErrors.filter(({ field }) =>
            [config.investigationTypeId, config.dateId, config.informationSourceId].includes(field)
          )
          return (
            value && (
              <UeMedicalInvestigation
                config={config}
                disabled={disabled}
                error={
                  index === 0 &&
                  validationErrors.length === 1 &&
                  !validationErrors.some(({ field }) =>
                    [config.investigationTypeId, config.dateId, config.informationSourceId].includes(field)
                  )
                }
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

export default UeMedicalInvestigationList
