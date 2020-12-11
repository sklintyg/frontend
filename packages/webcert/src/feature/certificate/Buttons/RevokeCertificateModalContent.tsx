import { RadioButton, TextArea, MandatoryIcon, InfoBox } from '@frontend/common'
import { Typography, Link, makeStyles, RadioGroup } from '@material-ui/core'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { RevokeCertificateReason } from '../../../store/certificate/certificateActions'
import { getIsLocked } from '../../../store/certificate/certificateSelectors'

const useStyles = makeStyles((theme) => ({
  textArea: {
    width: '100%',
  },
  subTitle: {
    fontWeight: theme.typography.fontWeightBold,
    margin: `${theme.spacing(2)}px 0`,
  },
  textAreaWrapper: {
    margin: `0 ${theme.spacing(3.9)}px`,
  },
  subtitle: {
    fontSize: theme.typography.subtitle2.fontSize,
    fontWeight: theme.typography.fontWeightBold,
  },
  mandatoryIcon: {
    top: '-6px',
  },
}))

interface Props {
  onChange: (obj: RevokeCertificateReason) => any
}

export const RevokeCertificateModalContent: React.FC<Props> = ({ onChange }) => {
  const classes = useStyles()
  const [textArea, setTextArea] = useState({ display: false, name: '', value: '' })
  const locked = useSelector(getIsLocked)

  const handleRadioButtonChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTextArea({ ...textArea, display: true, name: event.target.name })
    onChange({ reason: event.target.value, message: textArea.value })
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
      intyg på{' '}
      <Link underline="always" color="primary" href="www.minaintyg.se">
        minaintyg.se
      </Link>
    </>
  )

  const revokeReasonText = locked ? 'Ange varför du makulerar det låsta utkastet:' : 'Ange varför du makulerar intyget'

  const textLabel = locked ? 'Utkastet har skapats på fel patient' : 'Intyget har utfärdats på fel patient'

  return (
    <>
      <InfoBox type="info">{infoBoxText}</InfoBox>
      <Typography>{infoText}</Typography>
      <Typography className={classes.subTitle}>{revokeReasonText}</Typography>
      <RadioGroup aria-label="invoke reason" name="invokereason" value={textArea.name} onChange={handleRadioButtonChange}>
        {/* TODO: Add dynamic text below. "Utkastet har skapats på fel patient" || "Intyget har utfärdats på fel patient" */}
        <RadioButton
          id="radio_wrong_patient"
          onChange={handleRadioButtonChange}
          label={textLabel}
          //TODO: kolla om fel patient ska togglas om den är locked.
          value="FEL_PATIENT"
          name="FEL_PATIENT"></RadioButton>
        {textArea.display && textArea.name === 'FEL_PATIENT' && (
          <div className={classes.textAreaWrapper}>
            <Typography className={classes.subtitle}>Förtydliga vid behov</Typography>
            <TextArea
              rowsMin={4}
              additionalStyles={classes.textArea}
              name={textArea.name}
              value={textArea.value}
              onChange={handleTextAreaChange}></TextArea>
          </div>
        )}
        <RadioButton
          id="radio_other_mistake"
          onChange={handleRadioButtonChange}
          label="Annat allvarligt fel"
          value="ANNAT_ALLVARLIGT_FEL"
          name="ANNAT_ALLVARLIGT_FEL"></RadioButton>
        {textArea.display && textArea.name === 'ANNAT_ALLVARLIGT_FEL' && (
          <div className={classes.textAreaWrapper}>
            <Typography className={classes.subtitle}>
              <MandatoryIcon additionalStyles={classes.mandatoryIcon} display={textArea.value.length < 1} />
              Ange orsaken till felet.
            </Typography>
            <TextArea
              rowsMin={4}
              additionalStyles={classes.textArea}
              name={textArea.name}
              value={textArea.value}
              onChange={handleTextAreaChange}></TextArea>
          </div>
        )}
      </RadioGroup>
    </>
  )
}
