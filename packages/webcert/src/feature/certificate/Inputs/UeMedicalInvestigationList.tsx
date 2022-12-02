import { CertificateDataElement, Accordion } from '@frontend/common'
import {
  ValueMedicalInvestigation,
  ConfigUeMedicalInvestigationList,
  ValueMedicalInvestigationList,
} from '@frontend/common/src/types/certificate'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { updateCertificateDataElement } from '../../../store/certificate/certificateActions'
import { useAppDispatch } from '../../../store/store'
import UeMedicalInvestigation from './UeMedicalInvestigation'

export interface Props {
  disabled?: boolean
  question: CertificateDataElement
}

const UeMedicalInvestigationList: React.FC<Props> = ({ question, disabled }) => {
  const dispatch = useAppDispatch()
  const questionValue = question.value as ValueMedicalInvestigationList
  const questionConfig = question.config as ConfigUeMedicalInvestigationList
  //const values = (question.value as ValueMedicalInvestigationList).list
  //const [questionValueList, setQuestionValueList] = useState(values)
  const [questionValueList, setQuestionValueList] = useState<ValueMedicalInvestigation[]>(questionValue.list as ValueMedicalInvestigation[])

  const handleChange = (value: ValueMedicalInvestigation) => {
    updateList(questionValueList.map((item) => (item.id === value.id ? value : item)))
  }

  const updateList = (list: ValueMedicalInvestigation[]) => {
    setQuestionValueList(list)
    dispatch(
      updateCertificateDataElement({
        ...question,
        value: {
          ...questionValue,
          list: questionValueList,
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
        {questionConfig.list.map((config) => {
          console.log('config', config)

          //const valueSomething = config.list.find((item) => item.id === currentValue.id)
          // const value = questionValue.find((value) => )
          const value = questionValue.list.find((item) => item.id === config.id)
          console.log('value', value)
          return <UeMedicalInvestigation config={config} question={question} value={value} onChange={handleChange} />
        })}
      </div>
    </>
  )
}

export default UeMedicalInvestigationList
