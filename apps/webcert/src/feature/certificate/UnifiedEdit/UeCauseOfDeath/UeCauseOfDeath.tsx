import { useState } from 'react'
import { updateCertificateDataElement } from '../../../../store/certificate/certificateActions'
import { getVisibleValidationErrors } from '../../../../store/certificate/certificateSelectors'
import { useAppDispatch, useAppSelector } from '../../../../store/store'
import type { CertificateDataElement, ConfigUeCauseOfDeath, ValueCauseOfDeath } from '../../../../types'
import UeCauseOfDeathControl from './UeCauseOfDeathControl'

interface Props {
  disabled?: boolean
  question: CertificateDataElement
}

const UeCauseOfDeath = ({ disabled, question }: Props) => {
  const dispatch = useAppDispatch()
  const config = question.config as ConfigUeCauseOfDeath
  const validationErrors = useAppSelector(getVisibleValidationErrors(question.id))
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
          config={config.causeOfDeath}
          value={currentValue}
          disabled={disabled}
          onChange={handleChange}
          validation={question.validation}
          validationErrors={validationErrors}
        />
      </div>
    </div>
  )
}

export default UeCauseOfDeath
