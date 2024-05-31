import { useState } from 'react'
import { speechBubbleImage } from '../../../images'
import { answerComplementCertificate, complementCertificate } from '../../../store/certificate/certificateActions'
import { useAppDispatch } from '../../../store/store'
import { CannotComplementOption, ResourceLink, ResourceLinkType } from '../../../types'
import RadioButton from '../../Inputs/RadioButton'
import InfoBox from '../../utils/InfoBox'
import ButtonWithConfirmModal from '../../utils/Modal/ButtonWithConfirmModal'
import { CannotComplementTextarea } from './CannotComplementTextarea'

export function CannotComplementButton({ link }: { link: ResourceLink }) {
  const dispatch = useAppDispatch()
  const [option, setOption] = useState<string | null>()
  const [message, setMessage] = useState('')

  const onCannotComplementClick = () => {
    if (!option) return

    if (
      option === CannotComplementOption.NO_FURTHER_MED_INFO &&
      link.type !== ResourceLinkType.CANNOT_COMPLEMENT_CERTIFICATE_ONLY_MESSAGE
    ) {
      dispatch(complementCertificate({ message: message }))
    } else {
      dispatch(answerComplementCertificate(message))
    }
  }

  function getOptionLable(opt: CannotComplementOption) {
    switch (opt) {
      case CannotComplementOption.NO_FURTHER_MED_INFO:
        return 'Ingen ytterligare medicinsk information kan anges.'
      case CannotComplementOption.NO_RESP_MEDICAL_CONTENT:
        return 'Ingen på vårdenheten kan ansvara för det medicinska innehållet i intyget.'
    }
  }

  return (
    <ButtonWithConfirmModal
      disabled={!link.enabled}
      confirmButtonDisabled={!(option && message)}
      onConfirm={onCannotComplementClick}
      modalTitle="Kan ej komplettera"
      confirmButtonText="Skicka svar"
      name={link.name}
      description={link.description}
      buttonClasses="iu-mr-200"
      startIcon={<img src={speechBubbleImage} alt="Kan ej komplettera" />}
    >
      <div className="iu-color-black">
        <p className="iu-fw-bold iu-fs-200 iu-mb-300">
          {link.type === ResourceLinkType.CANNOT_COMPLEMENT_CERTIFICATE
            ? 'Ange varför intyget inte kan kompletteras med ett nytt intyg:'
            : 'Ange varför du inte kan komplettera med ett nytt intyg:'}
        </p>

        <div className="iu-mb-300">
          <InfoBox type="info">
            <p>Ingen medicinsk information får anges.</p>
          </InfoBox>
        </div>

        <div role="radiogroup" aria-label="Radiogrupp ge anledning för varför komplettering inte går" className="ic-radio-group-vertical">
          {Object.values(CannotComplementOption).map((id) => {
            return (
              <div key={id}>
                <RadioButton
                  id={id}
                  onChange={(event) => {
                    setMessage('')
                    setOption(event.target.value)
                  }}
                  label={getOptionLable(id)}
                  value={id}
                  checked={option === id}
                  name="radio_cannot_complement_reason"
                />
                {option === id && <CannotComplementTextarea option={option} message={message} link={link} onChange={setMessage} />}
              </div>
            )
          })}
        </div>
      </div>
    </ButtonWithConfirmModal>
  )
}
