import { makeStyles, Typography } from '@material-ui/core'
import React, { ReactNode } from 'react'
import { useSelector } from 'react-redux'
import { getCertificateMetaData } from '../../../store/certificate/certificateSelectors'
import AboutCertificatePanelFooter from './AboutCertificatePanelFooter'
import PanelHeader from './PanelHeader'
import colors from '../../../components/styles/colors'

const useStyles = makeStyles((theme) => ({
  contentWrapper: {
    padding: theme.spacing(2),
    height: '100%',
    overflowY: 'auto',
  },
  contentText: {
    whiteSpace: 'pre-line',
    marginTop: theme.spacing(1),
    fontSize: theme.typography.body2.fontSize,
  },
  border: {
    border: `1px solid ${colors.IA_COLOR_08}`,
  },
  certificateType: {
    fontWeight: theme.typography.fontWeightMedium,
  },
  certificateVersion: {
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.subtitle2.fontSize,
    marginLeft: theme.spacing(1),
    textTransform: 'uppercase',
  },
}))

interface Props {
  selectedTabIndex: number
  tabIndex: number
  minimizeSidePanel: ReactNode
}

const AboutCertificatePanel: React.FC<Props> = ({ tabIndex, selectedTabIndex, minimizeSidePanel }) => {
  const certMetaData = useSelector(getCertificateMetaData)
  const classes = useStyles()

  return (
    <>
      {selectedTabIndex === tabIndex && (
        <>
          <PanelHeader description="Om intyget" minimizeSidePanel={minimizeSidePanel} />
          <div className={`${classes.contentWrapper} ${classes.border}`}>
            <Typography className={classes.certificateType}>
              {certMetaData && (
                <>
                  {certMetaData.name}
                  <span className={classes.certificateVersion}>
                    {certMetaData.type} {certMetaData.typeVersion}
                  </span>
                </>
              )}
            </Typography>
            <Typography className={classes.contentText}>{certMetaData && certMetaData.description}</Typography>
          </div>
          <AboutCertificatePanelFooter />
        </>
      )}
    </>
  )
}

export default AboutCertificatePanel
