import { InfoBox, MandatoryIcon, RadioButton, TextArea } from '@frontend/common'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { RevokeCertificateReason } from '../../../store/certificate/certificateActions'
import { getIsLocked } from '../../../store/certificate/certificateSelectors'
import { css } from 'styled-components'
import WCDynamicLink from '../../../utils/WCDynamicLink'
import { getHasUnhandledQuestions } from '../../../store/question/questionSelectors'

const mandatoryIconAdditionalStyles = css`
  top: -4px;
`

interface Props {
  onChange: (obj: RevokeCertificateReason) => void
  type?: string
}

export const RevokeCertificateModalContent: React.FC<Props> = ({ onChange, type }) => {
  const [textArea, setTextArea] = useState({ display: false, name: '', value: '' })
  const locked = useSelector(getIsLocked)
  const recipient = type ? (type === 'lisjp' ? 'för Försäkringskassan' : '') : ''
  const hasUnhandledQuestions = useSelector(getHasUnhandledQuestions)

  const handleRadioButtonChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTextArea({ ...textArea, display: true, name: event.target.id, value: '' })
    onChange({ reason: event.target.value, message: '', title: '' })
  }

  const handleTextAreaChange = (event: React.ChangeEvent<HTMLTextAreaElement>, title: string) => {
    setTextArea({ ...textArea, value: event.target.value })
    onChange({ reason: textArea.name, message: event.target.value, title: title })
  }

  const unhandledQuestionsText = 'Om du går vidare och makulerar intyget kommer dina ej hanterade ärenden markeras som hanterade.'

  const infoBoxText = locked
    ? 'Om du fått ny information om patienten eller av annan anledning behöver korrigera innehållet i utkastet, bör du istället kopiera utkastet och skapa ett nytt intyg'
    : 'Om du fått ny information om patienten eller av annan anledning behöver korrigera innehållet i intyget, bör du istället ersätta intyget med ett nytt intyg.'

  const infoText = locked ? (
    'Ett låst utkast kan makuleras om det innehåller allvarliga fel. Exempel på ett allvarligt fel är om det är skapat för fel patient.'
  ) : (
    <>
      Ett intyg kan makuleras om det innehåller allvarliga fel. Exempel på ett allvarligt fel är om intyget är utfärdat på fel patient. Om
      intyget har skickats elektroniskt till en mottagare kommer denna att informeras om makuleringen. Invånaren kan inte se makluerade
      intyg på <WCDynamicLink linkKey={'minaintyg'} />. {hasUnhandledQuestions && unhandledQuestionsText}
    </>
  )

  const getRevokeReasonText = (): string => {
    if (locked) {
      return `Ange ${recipient} varför du makulerar det låsta utkastet:`
    } else {
      return `Ange ${recipient} varför du makulerar intyget:`
    }
  }

  const textLabel = locked ? 'Utkastet har skapats på fel patient' : 'Intyget har utfärdats på fel patient'

  return (
    <>
      <InfoBox type="info" activateIconWrap>
        <p>{infoBoxText}</p>
      </InfoBox>
      <p>{infoText}</p>
      <p className="iu-fw-bold iu-fs-200">{getRevokeReasonText()}</p>
      <div role="radiogroup" aria-label="Radiogrupp ge anledning för makulering" className="ic-radio-group-vertical">
        <RadioButton id="FEL_PATIENT" onChange={handleRadioButtonChange} label={textLabel} value="FEL_PATIENT" name="radio_invoke_reason" />
        {textArea.display && textArea.name === 'FEL_PATIENT' && (
          <div>
            <p className="iu-fw-bold iu-fs-200">Förtydliga vid behov</p>
            <TextArea
              rowsMin={3}
              name={textArea.name}
              value={textArea.value}
              onChange={(e) => handleTextAreaChange(e, textLabel)}
              limit={3500}
            />
          </div>
        )}
        <RadioButton
          id="ANNAT_ALLVARLIGT_FEL"
          onChange={handleRadioButtonChange}
          label="Annat allvarligt fel"
          value="ANNAT_ALLVARLIGT_FEL"
          name="radio_invoke_reason"
          wrapperAdditionalStyles={'iu-mt-200'}
        />
        {textArea.display && textArea.name === 'ANNAT_ALLVARLIGT_FEL' && (
          <div>
            <p className="iu-fw-bold iu-fs-200">
              <MandatoryIcon additionalStyles={mandatoryIconAdditionalStyles} display={textArea.value.length < 1} />
              Ange orsaken till felet.
            </p>
            <TextArea
              rowsMin={3}
              name={textArea.name}
              value={textArea.value}
              onChange={(e) => handleTextAreaChange(e, 'Annat allvarligt fel')}
              limit={3500}
            />
          </div>
        )}
      </div>
    </>
  )
}
