import { useDispatch } from 'react-redux'
import { CustomButton } from '../../../components/Inputs/CustomButton'
import ButtonWithConfirmModal from '../../../components/utils/Modal/ButtonWithConfirmModal'
import { checkImage } from '../../../images'
import { readyForSign } from '../../../store/certificate/certificateActions'

interface Props {
  name: string
  title?: string
  description: string
  enabled: boolean
  isValidForSigning: boolean
  functionDisabled: boolean
}

const ReadyForSignButton = ({ name, title, description, enabled, isValidForSigning, functionDisabled }: Props) => {
  const dispatch = useDispatch()

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
