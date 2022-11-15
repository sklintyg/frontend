import { CertificateDataElement, ConfigureUeCauseOfDeath, ValueCauseOfDeath } from '@frontend/common'
import React from 'react'

import UeCauseOfDeathControl from './UeCauseOfDeathControl'

export interface Props {
  config?: ConfigureUeCauseOfDeath
  value?: ValueCauseOfDeath
  disabled?: boolean
  hasValidationError?: boolean
  question: CertificateDataElement
}

const UeCauseOfDeath: React.FC<Props> = ({ config, value, disabled, hasValidationError, question }) => {
  config = question.config as ConfigureUeCauseOfDeath
  value = question.value as ValueCauseOfDeath

  return (
    <div className="ic-forms__group">
      {config.title}
      <div>
        {config.label && <div className="iu-fl iu-fs-700 iu-mr-400">{config.label}</div>}
        <UeCauseOfDeathControl
          config={config.causeOfDeath}
          value={value}
          question={question}
          disabled={disabled}
          hasValidationError={hasValidationError}
        />
      </div>
    </div>
  )
}

export default UeCauseOfDeath
