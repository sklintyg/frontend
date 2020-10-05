import React from 'react'
import { Paper, Tabs, Tab, Typography, Link } from '@material-ui/core'
import { getIsShowSpinner } from '../../store/certificate/certificateSelectors'
import { useSelector } from 'react-redux'
import SchoolIcon from '@material-ui/icons/School'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {
    overflowY: 'auto',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  contentWrapper: {
    padding: theme.spacing(2),
    flexGrow: 1,
  },
  contentText: {
    whiteSpace: 'pre-line',
    marginTop: theme.spacing(1),
    fontSize: theme.typography.body2.fontSize,
  },
  border: {
    border: '1px solid #cdced6',
  },
  certificateType: {
    fontWeight: theme.typography.fontWeightMedium,
  },
  certificateVersion: {
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.subtitle2.fontSize,
    marginLeft: theme.spacing(1),
  },
  helpWrapper: {
    color: '#00a9a7',
    position: 'sticky',
    bottom: '0',
    padding: theme.spacing(2.5),
  },
  tabs: {
    borderBottom: 0,
  },
}))

interface Props {}

const CertificateSidePanel: React.FC<Props> = (props) => {
  const showSpinner = useSelector(getIsShowSpinner)
  const classes = useStyles()

  if (showSpinner) return null

  // TODO: This string should be fetched from some source
  const string = `Arbetsförmedlingen behöver ett medicinskt utlåtande för en arbetssökande som har ett behov av fördjupat stöd.

  Vi behöver ett utlåtande för att kunna:

  • utreda och bedöma om den arbetssökande har en funktionsnedsättning som medför nedsatt arbetsförmåga
  • bedöma om vi behöver göra anpassningar i program eller insatser
  • erbjuda lämpliga utredande, vägledande, rehabiliterande eller arbetsförberedande insatser.`

  return (
    <>
      <Paper className={classes.root} square elevation={0}>
        <Tabs className={`${classes.border} ${classes.tabs}`} value={0} indicatorColor="primary">
          <Tab label="Om intyget" />
        </Tabs>
        <div className={`${classes.contentWrapper} ${classes.border}`}>
          <Typography className={classes.certificateType}>
            Arbetsförmedlingens medicinska utlåtande <span className={classes.certificateVersion}>AF00213 1.0</span>
          </Typography>
          <Typography className={classes.contentText}>{string}</Typography>
        </div>
        <div className={`${classes.helpWrapper} ${classes.border}`}>
          <Typography style={{ display: 'flex', alignItems: 'center' }} color={'inherit'}>
            <SchoolIcon style={{ marginRight: '5px' }} />
            <Link style={{ fontSize: '14px', display: 'inline-block' }} href={'#'} color={'inherit'}>
              Hitta svar på dina frågor i Ineras intygsskola
            </Link>
          </Typography>
        </div>
      </Paper>
    </>
  )
}

export default CertificateSidePanel
