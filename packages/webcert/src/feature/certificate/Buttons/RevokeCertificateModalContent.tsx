import { RadioButton, TextArea, MandatoryIcon, InfoBox } from '@frontend/common'
import { Typography, Link, makeStyles, RadioGroup } from '@material-ui/core'
import React, { useState } from 'react'
import { RevokeCertificateReason } from '../../../store/certificate/certificateActions'

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

export const RevokeCertificateModalContent = (props: Props) => {
  const classes = useStyles()
  const [textArea, setTextArea] = useState({ display: false, name: '', value: '' })

  const handleRadioButtonChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTextArea({ ...textArea, display: true, name: event.target.name })
    props.onChange({ reason: event.target.value, message: textArea.value })
  }

  const handleTextAreaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextArea({ ...textArea, value: event.target.value })
    props.onChange({ reason: textArea.name, message: event.target.value })
  }

  return (
    <>
      <InfoBox type="info">
        Om du fått ny information om patienten eller av annan anledning behöver korrigera innehållet i intyget, bör du istället ersätta
        intyget med ett nytt intyg.
      </InfoBox>
      <Typography>
        Ett intyg kan makuleras om det innehåller allvarliga fel. Exempel på ett allvarligt fel är om intyget är utfärdat på fel patient. Om
        intyget har skickats elektroniskt till en mottagare kommer denna att informeras om makuleringen. Invånaren kan inte se makluerade
        intyg på{' '}
        <Link underline="always" color="primary" href="www.minaintyg.se">
          minaintyg.se
        </Link>
      </Typography>
      <Typography className={classes.subTitle}>Ange varför du makulerar intyget</Typography>
      <RadioGroup aria-label="invoke reason" name="invokereason" value={textArea.name} onChange={handleRadioButtonChange}>
        {/* TODO: Add dynamic text below. "Utkastet har skapats på fel patient" || "Intyget har utfärdats på fel patient" */}
        <RadioButton
          onChange={handleRadioButtonChange}
          label="Intyget har utfärdats på fel patient"
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
