import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import QuestionValidationTexts from '../../../../components/Validation/QuestionValidationTexts'
import Accordion from '../../../../components/utils/Accordion'
import AccordionHeader from '../../../../components/utils/AccordionHeader'
import { Text } from '../../../../components/utils/Text'
import { updateCertificateDataElement } from '../../../../store/certificate/certificateActions'
import { getVisibleValidationErrors } from '../../../../store/certificate/certificateSelectors'
import { useAppDispatch } from '../../../../store/store'
import {
  CertificateDataElement,
  ConfigUeMedicalInvestigationList,
  ValueMedicalInvestigation,
  ValueMedicalInvestigationList,
} from '../../../../types'
import { sanitizeText } from '../../../../utils'
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
  margin-bottom: 0.625rem !important;
  &:after {
    right: 0 !important;
    top: 4px !important;
  }
`

const UeMedicalInvestigationList: React.FC<Props> = ({ question, disabled }) => {
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
      <UeMedicalInvestigationGrid>
        <h4>{questionConfig.typeText}</h4>
        <h4>{questionConfig.dateText}</h4>
        <Accordion>
          <StyledAccordionHeader>
            <h4 className={'iu-fs-300'}>{questionConfig.informationSourceText}</h4>
          </StyledAccordionHeader>
          <Text dangerouslySetInnerHTML={sanitizeText(questionConfig.informationSourceDescription)}></Text>
        </Accordion>
      </UeMedicalInvestigationGrid>
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

export default UeMedicalInvestigationList
