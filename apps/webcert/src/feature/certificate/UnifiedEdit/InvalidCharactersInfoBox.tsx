import { useState } from 'react'
import styled from 'styled-components'
import { ConfirmModal } from '../../../components/utils/Modal/ConfirmModal'
import InfoBox from '../../../components/utils/InfoBox'

const MoreInfoButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font-size: inherit;
  color: #00706e;
  text-decoration: underline;
`

const InfoBoxWrapper = styled.div`
  display: flex;
  padding: 12px 0;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  align-self: stretch;
`

const MODAL_BODY_TEXT =
  'När text klistras in omvandlas den till ren text och alla otillåtna symboler och dold formatering rensas bort. ' +
  'Detta för att säkerställa att intyget går att signera och hanteras av intygsmottagaren.\n\n' +
  'Exempel på otillåtna symboler och dold formatering är emojis och dolda mellanslag. '

interface Props {
  visible: boolean
}

const InvalidCharactersInfoBox = ({ visible }: Props) => {
  const [modalOpen, setModalOpen] = useState(false)

  if (!visible) {
    return null
  }

  return (
    <>
      <InfoBoxWrapper>
        <InfoBox type="observe">
          Tecken som inte stöds (dold formatering och symboler) har rensats bort. Granska texten och säkerställ att den är korrekt innan du
          signerar. <MoreInfoButton onClick={() => setModalOpen(true)}>Visa mer information</MoreInfoButton>
        </InfoBox>
      </InfoBoxWrapper>
      <ConfirmModal
        open={modalOpen}
        setOpen={setModalOpen}
        modalTitle="Tecken som inte stöds"
        confirmButtonText="Stäng"
        hideDeclineButton={true}
        onConfirm={() => setModalOpen(false)}
        disabled={false}
      >
        <p style={{ whiteSpace: 'pre-line' }}>{MODAL_BODY_TEXT}</p>
      </ConfirmModal>
    </>
  )
}

export default InvalidCharactersInfoBox
