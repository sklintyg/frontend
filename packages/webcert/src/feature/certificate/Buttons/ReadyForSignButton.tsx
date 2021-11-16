import { ButtonWithConfirmModal, CustomButton } from '@frontend/common'
import React from 'react'
import { readyForSign } from '../../../store/certificate/certificateActions'
import { useDispatch } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'

interface Props {
  name: string
  description: string
  enabled: boolean
  isValidForSigning: boolean
}

const ReadyForSignButton: React.FC<Props> = ({ name, description, enabled, isValidForSigning }) => {
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
      declineButtonText="Avbryt">
      <p>
        Observera att utkastet saknar obligatoriska uppgifter. Om du inte kan fylla i mer information kan du ändå markera intyget som klart
        för signering. Läkaren kommer då behöva komplettera intyget med de saknade uppgifterna innan det går att signera.{' '}
      </p>
    </ButtonWithConfirmModal>
  )

  const getComponentWhenDraftValid = () => (
    <CustomButton
      tooltip={description}
      disabled={!enabled}
      buttonStyle="primary"
      text={name}
      startIcon={<FontAwesomeIcon icon={faCheck} size="lg" />}
      onClick={() => dispatch(readyForSign())}
    />
  )

  return isValidForSigning ? getComponentWhenDraftValid() : getComponentWhenDraftInvalid()
}

export default ReadyForSignButton
