import { CertificateDataElement, Accordion } from '@frontend/common'
import {
  ValueMedicalInvestigation,
  ConfigUeMedicalInvestigationList,
  ConfigUeMedicalInvestigation,
  ValueMedicalInvestigationList,
} from '@frontend/common/src/types/certificate'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { updateCertificateDataElement } from '../../../store/certificate/certificateActions'
import UeMedicalInvestigation from './UeMedicalInvestigation'

export interface Props {
  disabled?: boolean
  question: CertificateDataElement
}

const UeMedicalInvestigationList: React.FC<Props> = ({ question, disabled }) => {
  const dispatch = useDispatch()
  //const questionValue = question.value as ValueMedicalInvestigation
  const values = (question.value as ValueMedicalInvestigationList).list
  const questionConfig = question.config as ConfigUeMedicalInvestigationList
  //const [questionValueList, setQuestionValueList] = useState(values)
  const [currentValue, setCurrentValue] = useState<ValueMedicalInvestigationList>(question.value as ValueMedicalInvestigationList)

  const handleChange = (value: ValueMedicalInvestigation) => {
    setCurrentValue(value)
    dispatch(
      updateCertificateDataElement({
        ...question,
        value,
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
        {questionConfig.list.map((config) => {
          // const valueSomething = config.list.find((item) => item.id === currentValue.id)
          // const value = questionValue.find((value) => )

          //const config = questionConfig.list.find((item) => item.id === value.id)
          return <UeMedicalInvestigation config={config} question={question} value={currentValue} onChange={handleChange} />
        })}
      </div>
    </>
  )
}

export default UeMedicalInvestigationList
