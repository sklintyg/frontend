import { ButtonWithConfirmModal, CustomButton } from '@frontend/common'
import React, { ReactNode } from 'react'
import { readyForSign } from '../../../store/certificate/certificateActions'
import { useDispatch } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { FunctionDisabled } from '../../../utils/functionDisablerUtils'

interface Props extends FunctionDisabled {
  name: string
  description: string
  enabled: boolean
  isValidForSigning: boolean
  onSaveModal?: (modal: ReactNode) => void
}

const ReadyForSignButton: React.FC<Props> = ({ name, description, enabled, isValidForSigning, functionDisabled, onSaveModal }) => {
  const dispatch = useDispatch()

  const getComponentWhenDraftInvalid = () => (
    <ButtonWithConfirmModal
      disabled={!enabled}
      description={description}
      name={name}
      startIcon={<FontAwesomeIcon size="lg" icon={faCheck} />}
      modalTitle="Markera utkast klart för signering"
      onConfirm={() => dispatch(readyForSign())}
      confirmButtonText="Markera klart för signering"
      declineButtonText="Avbryt"
      confirmButtonDisabled={functionDisabled}
      onSaveModal={onSaveModal}>
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
      startIcon={<FontAwesomeIcon icon={faCheck} size="lg" />}
      onClick={() => dispatch(readyForSign())}
    />
  )

  return isValidForSigning ? getComponentWhenDraftValid() : getComponentWhenDraftInvalid()
}

export default ReadyForSignButton
