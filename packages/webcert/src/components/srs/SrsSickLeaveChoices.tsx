import React, { ChangeEvent } from 'react'
import { RadioButton, SrsSickLeaveChoice } from '@frontend/common'
import { useDispatch, useSelector } from 'react-redux'
import { getSickLeaveChoice } from '../../store/srs/srsSelectors'
import { updateSickLeaveChoice } from '../../store/srs/srsActions'

export const SICKLEAVE_CHOICES_TEXTS = ['Ny sjukskrivning', 'Förlängning', 'Förlängning efter 60 dagar']

const SrsSickLeaveChoices: React.FC = () => {
  const buttons = [SrsSickLeaveChoice.NEW, SrsSickLeaveChoice.EXTENSION, SrsSickLeaveChoice.EXTENSION_AFTER_60_DAYS]
  const choice = useSelector(getSickLeaveChoice)
  const dispatch = useDispatch()

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(updateSickLeaveChoice(SrsSickLeaveChoice[event.currentTarget.value as keyof typeof SrsSickLeaveChoice]))
  }
  return (
    <div role="radiogroup" className="ic-radio-group-horizontal iu-mb-400">
      {buttons.map((button, index) => {
        return (
          <RadioButton
            label={SICKLEAVE_CHOICES_TEXTS[index]}
            onChange={onChange}
            key={`srsChoice${index}`}
            id={`srsChoice${index}`}
            value={button.toString()}
            checked={button.toString() === choice.toString()}
          />
        )
      })}
    </div>
  )
}

export default SrsSickLeaveChoices
