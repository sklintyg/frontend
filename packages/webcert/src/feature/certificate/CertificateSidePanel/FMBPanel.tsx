import { FormControlLabel, makeStyles, Radio, RadioGroup, Typography } from '@material-ui/core'
import React, { ChangeEvent, ReactNode, useState } from 'react'
import FMBPanelFooter from './FMBPanelFooter'
import PanelHeader from './PanelHeader'
import noDiagnosisIcon from './fmb_no_diagnosis.svg'
import { useSelector } from 'react-redux'
import { getFMBDiagnosisCodes } from '../../../store/fmb/fmbSelectors'
import { FMBDiagnosisCodeInfo } from '@frontend/common'
import FMBPanelDiagnosisInfo from './FMBPanelDiagnosisInfo'
import colors from '../../../components/styles/colors'

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'hidden',
    border: `1px solid ${colors.IA_COLOR_08}`,
  },
  emptyWrapper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    height: '100%',
    overflowY: 'auto',
  },
  diagnosisSelectionWrapper: {
    padding: theme.spacing(2),
    borderBottom: `1px solid ${colors.IA_COLOR_08}`,
  },
  link: {
    textDecoration: 'underline',
    fontSize: theme.typography.pxToRem(14),
  },
  radio: {
    paddingTop: theme.spacing(0),
    paddingBottom: theme.spacing(0),
  },
}))

interface Props {
  tabIndex: number
  selectedTabIndex: number
  minimizeSidePanel: ReactNode
}

const FMBPanel: React.FC<Props> = ({ tabIndex, selectedTabIndex, minimizeSidePanel }) => {
  const classes = useStyles()
  const fmbDiagnosisCodes = useSelector(getFMBDiagnosisCodes)
  const [selectedDiagnosisIndex, setSelectedDiagnosisIndex] = useState(0)

  const onDiagnosisSelect = (event: ChangeEvent<HTMLInputElement>, value: string) => {
    setSelectedDiagnosisIndex(parseInt(value))
  }

  return (
    <>
      {selectedTabIndex === tabIndex && (
        <div className={classes.root}>
          <PanelHeader description="Diagnosspecifik information" minimizeSidePanel={minimizeSidePanel} />
          {fmbDiagnosisCodes.length == 0 ? (
            <div className={classes.emptyWrapper}>
              <img alt="" src={noDiagnosisIcon} />
              <div>Ange minst en diagnos för att få FMB-stöd.</div>
            </div>
          ) : (
            <>
              <div className={classes.diagnosisSelectionWrapper}>
                <RadioGroup value={selectedDiagnosisIndex} onChange={onDiagnosisSelect}>
                  {fmbDiagnosisCodes.map((diagnosisCode: FMBDiagnosisCodeInfo, index: number) => (
                    <FormControlLabel
                      key={diagnosisCode.icd10Code}
                      value={index}
                      control={<Radio className={classes.radio} />}
                      label={<Typography className={classes.link}>{diagnosisCode.icd10Description}</Typography>}
                    />
                  ))}
                </RadioGroup>
              </div>
              <FMBPanelDiagnosisInfo diagnosisCodes={fmbDiagnosisCodes} selectedDiagnosisIndex={selectedDiagnosisIndex} />
            </>
          )}
          <FMBPanelFooter />
        </div>
      )}
    </>
  )
}

export default FMBPanel
