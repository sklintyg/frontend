import { CertificateDataElement, ConfigureUeCauseOfDeath, ValueCauseOfDeath } from '@frontend/common'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateCertificateDataElement } from '../../../../store/certificate/certificateActions'
import { getVisibleValidationErrors, getShowValidationErrors } from '../../../../store/certificate/certificateSelectors'
import UeCauseOfDeathControl from './UeCauseOfDeathControl'

interface Props {
  disabled?: boolean
  question: CertificateDataElement
}

const UeCauseOfDeath: React.FC<Props> = ({ disabled, question }) => {
  const dispatch = useDispatch()
  const config = question.config as ConfigureUeCauseOfDeath
  const validationErrors = useSelector(getVisibleValidationErrors(question.id))
  const isShowValidationError = useSelector(getShowValidationErrors)
  const [currentValue, setCurrentValue] = useState<ValueCauseOfDeath>(question.value as ValueCauseOfDeath)

  const handleChange = (value: ValueCauseOfDeath) => {
    setCurrentValue(value)
    dispatch(
      updateCertificateDataElement({
        ...question,
        value,
      })
    )
  }

  return (
    <div className="ic-forms__group">
      {config.title}
      <div>
        {config.label && <div className="iu-fl iu-fs-700 iu-mr-400">{config.label}</div>}
        <UeCauseOfDeathControl
          questionId={question.id}
          config={config.causeOfDeath}
          value={currentValue}
          disabled={disabled}
          onChange={handleChange}
          isShowValidationError={isShowValidationError}
          validation={question.validation}
          validationErrors={validationErrors}
        />
      </div>
    </div>
  )
}

export default UeCauseOfDeath
