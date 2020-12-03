import { Link, makeStyles, Typography } from '@material-ui/core'
import React from 'react'
import { ButtonTooltip, FMBDiagnosisCodeInfo, FMBDiagnosisCodeInfoForm, FMBDiagnosisCodeInfoFormContent } from '@frontend/common'
import ExpandableText from '@frontend/common/src/components/utils/ExpandableText'
import LaunchIcon from '@material-ui/icons/Launch'
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined'
import colors from '../../../components/styles/colors'

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    overflowY: 'auto',
  },
  contentWrapper: {
    padding: theme.spacing(2),
  },
  contentText: {
    marginTop: theme.spacing(1),
  },
  solidBackground: {
    backgroundColor: colors.IA_COLOR_15,
  },
  header: {
    fontWeight: theme.typography.fontWeightMedium,
  },
  subHeader: {
    fontWeight: theme.typography.fontWeightMedium,
    fontSize: theme.typography.subtitle2.fontSize,
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    fontSize: theme.typography.pxToRem(14),
    color: 'inherit',
    textDecoration: 'underline',
  },
  icon: {
    fontSize: 'medium',
    marginLeft: '3px',
  },
  iconMargin: {
    marginLeft: '6px',
    marginBottom: '3px',
  },
  alignCenter: {
    display: 'flex',
    alignItems: 'center',
  },
}))

interface Props {
  diagnosisCodes: FMBDiagnosisCodeInfo[]
  selectedDiagnosisIndex: number
}

const FMBPanelDiagnosisInfo: React.FC<Props> = ({ diagnosisCodes, selectedDiagnosisIndex }) => {
  const classes = useStyles()
  const maxTextLength = 300

  return (
    <>
      <div className={classes.root}>
        <div className={classes.contentWrapper}>
          <Typography className={`${classes.subHeader} ${classes.alignCenter}`}>
            Vägledning för sjukskrivning
            <ButtonTooltip
              description={'Vägledning för sjukskrivning vid ' + diagnosisCodes[selectedDiagnosisIndex].icd10Description + '.'}>
              <InfoOutlinedIcon className={classes.iconMargin} />
            </ButtonTooltip>
          </Typography>
          <ul>
            {diagnosisCodes[selectedDiagnosisIndex].forms
              .filter((form: FMBDiagnosisCodeInfoForm) => form.name === 'ARBETSFORMAGA')
              .map((form: FMBDiagnosisCodeInfoForm) =>
                form.content[0].list?.map((item: string, index: number) => (
                  <li key={index} className={classes.contentText}>
                    {item}
                  </li>
                ))
              )}
          </ul>
        </div>
        <Typography className={`${classes.contentWrapper} ${classes.header} ${classes.solidBackground}`}>
          {diagnosisCodes[selectedDiagnosisIndex].icd10Description}
        </Typography>
        <div className={classes.contentWrapper}>
          <Typography className={`${classes.subHeader} ${classes.alignCenter}`}>
            Relaterade diagnoskoder (ICD-10-SE)
            <ButtonTooltip description="Informationen nedan gäller för angivna diagnoskoder, men kan även vara relevant för fler diagnoskoder.">
              <InfoOutlinedIcon className={classes.iconMargin} />
            </ButtonTooltip>
          </Typography>
          <div>{diagnosisCodes[selectedDiagnosisIndex].relatedDiagnoses}</div>
        </div>
        <div className={classes.contentWrapper}>
          <Typography className={classes.subHeader}>Funktionsnedsättning</Typography>
          {diagnosisCodes[selectedDiagnosisIndex].forms
            .filter((form: FMBDiagnosisCodeInfoForm) => form.name === 'FUNKTIONSNEDSATTNING')
            .map((form: FMBDiagnosisCodeInfoForm) => (
              <ExpandableText key={form.name} text={form.content[0].text ?? ''} maxLength={maxTextLength} />
            ))}
        </div>
        <div className={classes.contentWrapper}>
          <Typography className={classes.subHeader}>Aktivitetsbegränsning</Typography>
          <div>
            {diagnosisCodes[selectedDiagnosisIndex].forms
              .filter((form: FMBDiagnosisCodeInfoForm) => form.name === 'AKTIVITETSBEGRANSNING')
              .map((form: FMBDiagnosisCodeInfoForm) => (
                <ExpandableText key={form.name} text={form.content[0].text ?? ''} maxLength={maxTextLength} />
              ))}
          </div>
        </div>
        <div className={classes.contentWrapper}>
          <Typography className={classes.subHeader}>Information om rehabilitering</Typography>
          <div>
            {diagnosisCodes[selectedDiagnosisIndex].forms
              .filter((form: FMBDiagnosisCodeInfoForm) => form.name === 'INFORMATIONOMREHABILITERING')
              .map((form: FMBDiagnosisCodeInfoForm) => (
                <ExpandableText key={form.name} text={form.content[0].text ?? ''} maxLength={maxTextLength} />
              ))}
          </div>
        </div>
        <div className={classes.contentWrapper}>
          <Typography className={classes.subHeader}>Försäkringsmedicinsk information</Typography>
          <div>
            {diagnosisCodes[selectedDiagnosisIndex].forms
              .filter((form: FMBDiagnosisCodeInfoForm) => form.name === 'DIAGNOS')
              .map((form: FMBDiagnosisCodeInfoForm) =>
                form.content
                  .filter((content: FMBDiagnosisCodeInfoFormContent) => content.heading === 'GENERELL_INFO')
                  .map((content: FMBDiagnosisCodeInfoFormContent) => (
                    <ExpandableText key={content.heading} text={content.text ?? ''} maxLength={maxTextLength} />
                  ))
              )}
          </div>
        </div>
        <div className={classes.contentWrapper}>
          <Typography className={classes.subHeader}>Symtom, prognos, behandling</Typography>
          <div>
            {diagnosisCodes[selectedDiagnosisIndex].forms
              .filter((form: FMBDiagnosisCodeInfoForm) => form.name === 'DIAGNOS')
              .map((form: FMBDiagnosisCodeInfoForm) =>
                form.content
                  .filter((content: FMBDiagnosisCodeInfoFormContent) => content.heading === 'SYMPTOM_PROGNOS_BEHANDLING')
                  .map((content: FMBDiagnosisCodeInfoFormContent) => (
                    <ExpandableText key={content.heading} text={content.text ?? ''} maxLength={maxTextLength} />
                  ))
              )}
          </div>
        </div>
        <div className={`${classes.contentWrapper} ${classes.solidBackground}`}>
          <Typography className={classes.header}>Mer information</Typography>
          <div>
            <Link className={classes.link} target="_blank" href={diagnosisCodes[selectedDiagnosisIndex].referenceLink}>
              <Typography className={classes.link}>{diagnosisCodes[selectedDiagnosisIndex].referenceDescription}</Typography>
              <LaunchIcon className={classes.icon} />
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default FMBPanelDiagnosisInfo
