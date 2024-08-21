import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { hideValidationErrors, showValidationErrors } from '../../../store/certificate/certificateActions'
import { getShowValidationErrors } from '../../../store/certificate/certificateSelectors'

const ShowValidationErrorsSwitch: React.FC = () => {
  const showErrors = useSelector(getShowValidationErrors)
  const dispatch = useDispatch()
  const [toggled, setToggled] = useState(showErrors)

  const handleToggle = () => {
    dispatch(toggled ? hideValidationErrors() : showValidationErrors())
    setToggled(!toggled)
  }

  return (
    <div role="group" aria-label="Label for checkbox group" className="ic-checkbox-group-horizontal">
      <input
        className="ic-forms__checkbox"
        type="checkbox"
        id="show-validation-errors"
        name="show-validation-errors"
        checked={toggled}
        onChange={handleToggle}
      />
      <label className="iu-fs-200" htmlFor="show-validation-errors">
        Visa vad som saknas
      </label>
    </div>
  )
}

export default ShowValidationErrorsSwitch
