import { ButtonWithConfirmModal, checkImage, CustomButton } from '@frontend/common'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import ReactTooltip from 'react-tooltip'
import { readyForSign } from '../../../store/certificate/certificateActions'
import { FunctionDisabled } from '../../../utils/functionDisablerUtils'

interface Props extends FunctionDisabled {
  name: string
  title?: string
  description: string
  enabled: boolean
  isValidForSigning: boolean
}

const ReadyForSignButton: React.FC<Props> = ({ name, title, description, enabled, isValidForSigning, functionDisabled }) => {
  const dispatch = useDispatch()

  useEffect(() => {
    ReactTooltip.rebuild()
  })

  const getComponentWhenDraftInvalid = () => (
    <ButtonWithConfirmModal
      disabled={!enabled}
      description={description}
      name={title ?? name}
      startIcon={<img src={checkImage} alt="Check" />}
      modalTitle="Markera utkast klart för signering"
      onConfirm={() => dispatch(readyForSign())}
      confirmButtonText="Markera klart för signering"
      declineButtonText="Avbryt"
      confirmButtonDisabled={functionDisabled}
      buttonTestId="ready-for-sign-certificate-button"
    >
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
      data-testid="ready-for-sign-certificate-button"
      startIcon={<img src={checkImage} alt="Check" />}
      onClick={() => dispatch(readyForSign())}
    />
  )

  return isValidForSigning ? getComponentWhenDraftValid() : getComponentWhenDraftInvalid()
}

export default ReadyForSignButton
