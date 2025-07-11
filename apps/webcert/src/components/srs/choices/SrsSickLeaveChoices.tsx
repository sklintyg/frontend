import type { ChangeEvent } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateHasUpdatedAnswers, updateSickLeaveChoice } from '../../../store/srs/srsActions'
import { getIsCertificateRenewed, getSickLeaveChoice } from '../../../store/srs/srsSelectors'
import { SrsSickLeaveChoice } from '../../../types'
import RadioButton from '../../Inputs/RadioButton'
import { getSickLeaveChoicesLabel } from '../srsUtils'

const SrsSickLeaveChoices = () => {
  const buttons = [SrsSickLeaveChoice.NEW, SrsSickLeaveChoice.EXTENSION, SrsSickLeaveChoice.EXTENSION_AFTER_60_DAYS]
  const choice = useSelector(getSickLeaveChoice)
  const dispatch = useDispatch()
  const isCertificateRenewal = useSelector(getIsCertificateRenewed)

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(updateSickLeaveChoice(SrsSickLeaveChoice[event.currentTarget.value as keyof typeof SrsSickLeaveChoice]))
    dispatch(updateHasUpdatedAnswers(true))
  }

  return (
    <div role="radiogroup" className="ic-radio-group-horizontal iu-mb-400">
      {buttons.map((button, index) => {
        return (
          <RadioButton
            label={getSickLeaveChoicesLabel(buttons[index])}
            onChange={onChange}
            key={`srsChoice${index}`}
            id={`srsChoice${index}`}
            disabled={index === 0 ? isCertificateRenewal : false}
            value={button.toString()}
            checked={button.toString() === choice.toString()}
          />
        )
      })}
    </div>
  )
}

export default SrsSickLeaveChoices
