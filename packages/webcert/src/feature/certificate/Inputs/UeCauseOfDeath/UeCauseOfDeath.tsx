import { CertificateDataElement, ConfigureUeCauseOfDeath, ValueCauseOfDeath } from '@frontend/common'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateCertificateDataElement } from '../../../../store/certificate/certificateActions'
import { getVisibleValidationErrors } from '../../../../store/certificate/certificateSelectors'
import UeCauseOfDeathControl from './UeCauseOfDeathControl'

export interface Props {
  config?: ConfigureUeCauseOfDeath
  value?: ValueCauseOfDeath
  disabled?: boolean
  hasValidationError?: boolean
  question: CertificateDataElement
}

const UeCauseOfDeath: React.FC<Props> = ({ config, value, disabled, hasValidationError, question }) => {
  const dispatch = useDispatch()
  config = question.config as ConfigureUeCauseOfDeath
  value = question.value as ValueCauseOfDeath
  const validationErrors = useSelector(getVisibleValidationErrors(question.id, config.id))

  const handleChange = (value: ValueCauseOfDeath) => {
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
          id={question.id}
          config={config}
          value={value}
          disabled={disabled}
          onChange={handleChange}
          hasValidationError={hasValidationError}
          validation={question.validation}
          validationErrors={validationErrors}
        />
      </div>
    </div>
  )
}

export default UeCauseOfDeath
