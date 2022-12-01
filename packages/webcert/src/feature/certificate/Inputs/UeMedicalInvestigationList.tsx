import { CertificateDataElement, Accordion } from '@frontend/common'
import { ValueMedicalInvestigation, ConfigUeMedicalInvestigationList } from '@frontend/common/src/types/certificate'
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
  const questionValue = question.value as ValueMedicalInvestigation
  const config = question.config as ConfigUeMedicalInvestigationList
  const [currentValue, setCurrentValue] = useState<ValueMedicalInvestigation>(question.value as ValueMedicalInvestigation)

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
        <h4>{config.typeText}</h4>
        <h4>{config.dateText}</h4>
        <Accordion title={config.informationSourceText} titleId={''} description={config.informationSourceDescription} />
      </div>
      <div className="ic-forms__group iu-grid-rows">
        {config.list.map((listItem) => {
          return (
            <UeMedicalInvestigation
              id={listItem.id}
              config={listItem}
              questionId={question.id}
              value={currentValue}
              onChange={handleChange}
            />
          )
        })}
      </div>
    </>
  )
}

export default UeMedicalInvestigationList
