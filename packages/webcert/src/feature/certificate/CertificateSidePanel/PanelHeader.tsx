import { makeStyles, Typography } from '@material-ui/core'
import React, { ReactNode } from 'react'
import colors from '../../../components/styles/colors'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: colors.IA_COLOR_08,
    position: 'sticky',
    bottom: '0',
    padding: theme.spacing(2.5),
  },
  text: {
    fontWeight: theme.typography.fontWeightMedium,
  },
}))

interface Props {
  description: string
  minimizeSidePanel: ReactNode
}

const PanelHeader: React.FC<Props> = ({ description, minimizeSidePanel }) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Typography className={classes.text}>{description}</Typography>
      {minimizeSidePanel}
    </div>
  )
}

export default PanelHeader
