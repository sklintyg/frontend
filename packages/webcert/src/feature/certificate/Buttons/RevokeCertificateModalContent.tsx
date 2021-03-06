import { RadioButton, TextArea, MandatoryIcon, InfoBox } from '@frontend/common'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { RevokeCertificateReason } from '../../../store/certificate/certificateActions'
import { getIsLocked } from '../../../store/certificate/certificateSelectors'
import { css } from 'styled-components'
import { useEffect } from 'react'

const mandatoryIconAdditonalStyles = css`
  top: -4px;
`

interface Props {
  onChange: (obj: RevokeCertificateReason) => void
}

export const RevokeCertificateModalContent: React.FC<Props> = ({ onChange }) => {
  const [textArea, setTextArea] = useState({ display: false, name: '', value: '' })
  const locked = useSelector(getIsLocked)

  const handleRadioButtonChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('radio button on change')
    setTextArea({ ...textArea, display: true, name: event.target.id })
    onChange({ reason: event.target.name, message: textArea.value })
  }

  const handleTextAreaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextArea({ ...textArea, value: event.target.value })
    onChange({ reason: textArea.name, message: event.target.value })
  }

  const infoBoxText = locked
    ? 'Om du fått ny information om patienten eller av annan anledning behöver korrigera innehållet i utkastet, bör du istället kopiera utkastet och skapa ett nytt intyg'
    : 'Om du fått ny information om patienten eller av annan anledning behöver korrigera innehållet i intyget, bör du istället ersätta intyget med ett nytt intyg.'

  const infoText = locked ? (
    'Ett låst utkast kan makuleras om det innehåller allvarliga fel. Exempel på ett allvarligt fel är om det är skapat för fel patient.'
  ) : (
    <>
      Ett intyg kan makuleras om det innehåller allvarliga fel. Exempel på ett allvarligt fel är om intyget är utfärdat på fel patient. Om
      intyget har skickats elektroniskt till en mottagare kommer denna att informeras om makuleringen. Invånaren kan inte se makluerade
      intyg på <a href={'https://www.minaintyg.se'}>minaintyg.se</a>
    </>
  )

  const revokeReasonText = locked ? 'Ange varför du makulerar det låsta utkastet:' : 'Ange varför du makulerar intyget'

  const textLabel = locked ? 'Utkastet har skapats på fel patient' : 'Intyget har utfärdats på fel patient'

  return (
    <>
      <InfoBox type="info">{infoBoxText}</InfoBox>
      <p>{infoText}</p>
      <p className="iu-fw-bold iu-fs-200">{revokeReasonText}</p>
      <div role="radiogroup" aria-label="Radiogrupp ge anledning för makulering" className="ic-radio-group-vertical">
        {/* TODO: Add dynamic text below. "Utkastet har skapats på fel patient" || "Intyget har utfärdats på fel patient" */}
        <RadioButton
          id="FEL_PATIENT"
          onChange={handleRadioButtonChange}
          label={textLabel}
          //TODO: kolla om fel patient ska togglas om den är locked.
          value="FEL_PATIENT"
          name="radio_invoke_reason"
        />
        {textArea.display && textArea.name === 'FEL_PATIENT' && (
          <div>
            <p className="iu-fw-bold iu-fs-200">Förtydliga vid behov</p>
            <TextArea rowsMin={4} name={textArea.name} value={textArea.value} onChange={handleTextAreaChange} />
          </div>
        )}
        <RadioButton
          id="ANNAT_ALLVARLIGT_FEL"
          onChange={handleRadioButtonChange}
          label="Annat allvarligt fel"
          value="ANNAT_ALLVARLIGT_FEL"
          name="radio_invoke_reason"
        />
        {textArea.display && textArea.name === 'ANNAT_ALLVARLIGT_FEL' && (
          <div>
            <p className="iu-fw-bold iu-fs-200">
              <MandatoryIcon additionalStyles={mandatoryIconAdditonalStyles} display={textArea.value.length < 1} />
              Ange orsaken till felet.
            </p>
            <TextArea rowsMin={4} name={textArea.name} value={textArea.value} onChange={handleTextAreaChange} />
          </div>
        )}
      </div>
    </>
  )
}
