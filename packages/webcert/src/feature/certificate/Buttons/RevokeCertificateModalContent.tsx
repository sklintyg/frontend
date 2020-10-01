import { RadioButton, TextArea } from '@frontend/common'
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
      <Typography>
        Ett intyg kan makuleras om det innehåller allvarliga fel. Exempel på ett allvarligt fel är om intyget är utfärdat på fel patient. Om
        intyget har skickats elektroniskt till en mottagare kommer denna att informeras om makuleringen. Invånaren kan inte se makluerade
        intyg på{' '}
        <Link underline="always" color="primary" href="www.minaintyg.se">
          minaintyg.se
        </Link>
      </Typography>
      <Typography className={classes.subTitle}>Ange för Arbetsförmedlingen varför du makulerar intyget:</Typography>
      <RadioGroup aria-label="invoke reason" name="invokereason" value={textArea.name} onChange={handleRadioButtonChange}>
        {/* TODO: Add dynamic text below. "Utkastet har skapats på fel patient" || "Intyget har utfärdats på fel patient" */}
        <RadioButton
          onChange={handleRadioButtonChange}
          label="Intyget har utfärdats på fel patient"
          value="FEL_PATIENT"
          name="FEL_PATIENT"></RadioButton>
        <RadioButton
          onChange={handleRadioButtonChange}
          label="Annat allvarligt fel"
          value="ANNAT_ALLVARLIGT_FEL"
          name="ANNAT_ALLVARLIGT_FEL"></RadioButton>
      </RadioGroup>
      {textArea.display && (
        <TextArea
          rowsMin={4}
          additionalStyles={classes.textArea}
          name={textArea.name}
          value={textArea.value}
          hasValidationError={textArea.value.length < 1}
          onChange={handleTextAreaChange}></TextArea>
      )}
    </>
  )
}
