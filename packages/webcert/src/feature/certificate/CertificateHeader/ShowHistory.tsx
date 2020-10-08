import React from 'react'
import { TextWithInfoModal } from '@frontend/common'
import { makeStyles, Typography } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  root: {
    fontSize: '12px',
    color: theme.palette.info.dark,
  },
}))

interface Props {
  historyEntries: string[]
}

const ShowHistory: React.FC<Props> = ({ historyEntries }) => {
  const classes = useStyles()

  //TODO: These history entries need to come from metadata
  return (
    <Typography className={classes.root}>
      <TextWithInfoModal text="Visa alla händelser" modalTitle="Alla händelser">
        {historyEntries.map((entry) => (
          <Typography>{entry}</Typography>
        ))}
      </TextWithInfoModal>
    </Typography>
  )
}

export default ShowHistory
