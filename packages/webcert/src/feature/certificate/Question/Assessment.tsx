import { makeStyles, TextField, Typography } from '@material-ui/core'
import React, { useState } from 'react'
import EmojiObjectsOutlinedIcon from '@material-ui/icons/EmojiObjectsOutlined'
import colors from '../../../components/styles/colors'

const useStyles = makeStyles((theme) => ({
  daysRangeWrapper: {
    display: 'flex',
    alignItems: 'center',
    margin: `${theme.spacing(2)}px 0`,
  },
  lampIcon: {
    color: colors.IA_COLOR_05,
  },
  input: {
    boxSizing: 'border-box',
    height: theme.typography.pxToRem(38),
    maxWidth: theme.typography.pxToRem(32),
  },
  inputRoot: {
    borderRight: 0,
    margin: `0 ${theme.spacing(1)}px`,
  },
  test: {
    padding: 6,
  },
}))

interface Props {}

const Assessment: React.FC<Props> = (props) => {
  const classes = useStyles()
  const [hours, setHours] = useState<number | null>(null)

  const onTextInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    console.log(event.target.value)
    const inputHours = parseInt(event.target.value)

    if (!isNaN(inputHours)) {
      console.log('is number!', inputHours)
    }
  }

  return (
    <div>
      <Typography>Min bedömning av patientens nedsättning av arbetsförmågan</Typography>
      <div className={classes.daysRangeWrapper}>
        <EmojiObjectsOutlinedIcon className={classes.lampIcon} />
        <Typography>Patienten arbetar i snitt</Typography>
        <TextField
          InputProps={{
            classes: {
              root: classes.inputRoot,
            },
            className: classes.input,
          }}
          inputProps={{ maxLength: 2, className: classes.test }}
          variant="outlined"
          onChange={onTextInputChange}
          value={hours}
        />
        <Typography>timmar/vecka</Typography>
      </div>
    </div>
  )
}

export default Assessment
