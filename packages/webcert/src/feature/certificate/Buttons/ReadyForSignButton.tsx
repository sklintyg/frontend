import { ButtonWithConfirmModal, CustomButton } from '@frontend/common'
import React, { useEffect } from 'react'
import { readyForSign } from '../../../store/certificate/certificateActions'
import { useDispatch } from 'react-redux'
import { FunctionDisabled } from '../../../utils/functionDisablerUtils'
import check from '@frontend/common/src/images/check.svg'
import ReactTooltip from 'react-tooltip'

interface Props extends FunctionDisabled {
  name: string
  description: string
  enabled: boolean
  isValidForSigning: boolean
}

const ReadyForSignButton: React.FC<Props> = ({ name, description, enabled, isValidForSigning, functionDisabled }) => {
  const dispatch = useDispatch()

  useEffect(() => {
    ReactTooltip.rebuild()
  })

  const getComponentWhenDraftInvalid = () => (
    <ButtonWithConfirmModal
      disabled={!enabled}
      description={description}
      name={name}
      startIcon={<img src={check} alt="Check" />}
      modalTitle="Markera utkast klart för signering"
      onConfirm={() => dispatch(readyForSign())}
      confirmButtonText="Markera klart för signering"
      declineButtonText="Avbryt"
      confirmButtonDisabled={functionDisabled}>
      <p>
        Observera att utkastet saknar obligatoriska uppgifter. Om du inte kan fylla i mer information kan du ändå markera intyget som klart
        för signering. Läkaren kommer då behöva komplettera intyget med de saknade uppgifterna innan det går att signera.{' '}
      </p>
    </ButtonWithConfirmModal>
  )

  const getComponentWhenDraftValid = () => (
    <CustomButton
      tooltip={description}
      disabled={!enabled || functionDisabled}
      buttonStyle="primary"
      text={name}
      startIcon={<img src={check} alt="Check" />}
      onClick={() => dispatch(readyForSign())}
    />
  )

  return isValidForSigning ? getComponentWhenDraftValid() : getComponentWhenDraftInvalid()
}

export default ReadyForSignButton
