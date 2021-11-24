import { InfoBox, MandatoryIcon, RadioButton, TextArea } from '@frontend/common'
import React, { useState } from 'react'
import { css } from 'styled-components'

const mandatoryIconAdditionalStyles = css`
  top: -4px;
`

export interface CannotComplementData {
  answerWithCertificate: boolean
  message: string
}

interface Props {
  onChange: (data: CannotComplementData) => void
}

export const CannotComplementModalContent: React.FC<Props> = ({ onChange }) => {
  const [textArea, setTextArea] = useState({ display: false, name: '', value: '' })

  const handleRadioButtonChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTextArea({ ...textArea, display: true, name: event.target.id, value: '' })
    onChange({ answerWithCertificate: event.target.id === 'ANSWER_WITH_CERTIFICATE', message: '' })
  }

  const handleTextAreaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextArea({ ...textArea, value: event.target.value })
    onChange({ answerWithCertificate: textArea.name === 'ANSWER_WITH_CERTIFICATE', message: event.target.value })
  }

  return (
    <div className={'iu-color-black'}>
      <p className="iu-fw-bold iu-fs-200 iu-mb-300">Ange varför intyget inte kan kompletteras med ett nytt intyg:</p>
      <div role="radiogroup" aria-label="Radiogrupp ge anledning för varför komplettering inte går" className="ic-radio-group-vertical">
        <RadioButton
          id="ANSWER_WITH_CERTIFICATE"
          onChange={handleRadioButtonChange}
          label="Ingen ytterligare medicinsk information kan anges."
          value="ANSWER_WITH_CERTIFICATE"
          name="radio_cannot_complement_reason"
        />
        {textArea.display && textArea.name === 'ANSWER_WITH_CERTIFICATE' && (
          <div className={'iu-ml-700 iu-my-300'}>
            <p className="iu-fs-200 iu-mb-300">
              <MandatoryIcon additionalStyles={mandatoryIconAdditionalStyles} display={textArea.value.length < 1} />
              Kommentera varför det inte är möjligt att ange ytterligare medicinsk information. När du skickar svaret skapas en kopia av
              intyget med din kommentar i fältet "Övriga upplysningar". Intyget måste därefter signeras och skickas till Försäkringskassan.
            </p>
            <TextArea rowsMin={3} name={textArea.name} value={textArea.value} onChange={handleTextAreaChange} limit={500} />
          </div>
        )}
        <RadioButton
          id="ANSWER_WITH_MESSAGE"
          onChange={handleRadioButtonChange}
          label="Ingen på vårdenheten kan ansvara för det medicinska innehållet i intyget."
          value="ANSWER_WITH_MESSAGE"
          name="radio_cannot_complement_reason"
        />
        {textArea.display && textArea.name === 'ANSWER_WITH_MESSAGE' && (
          <div className={'iu-ml-700 iu-my-300'}>
            <InfoBox type="observe">
              <p>Ingen medicinsk information får anges.</p>
            </InfoBox>
            <p className="iu-fs-200 iu-my-300">
              <MandatoryIcon additionalStyles={mandatoryIconAdditionalStyles} display={textArea.value.length < 1} />
              Om intygsutfärdaren inte längre finns tillgänglig och ingen annan på vårdenheten kan ta det medicinska ansvaret för intyget,
              så ska du delge Försäkringskassan det genom att svara med ett meddelande.{' '}
            </p>
            <TextArea rowsMin={3} name={textArea.name} value={textArea.value} onChange={handleTextAreaChange} limit={500} />
          </div>
        )}
      </div>
    </div>
  )
}
