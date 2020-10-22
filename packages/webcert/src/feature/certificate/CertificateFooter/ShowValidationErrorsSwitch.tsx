import { makeStyles, FormControlLabel, Switch } from '@material-ui/core'
import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { hideValidationErrors, showValidationErrors } from '../../../store/certificate/certificateActions'
import { getShowValidationErrors } from '../../../store/certificate/certificateSelectors'

const useStyles = makeStyles((theme) => ({
  root: {
    width: 56,
    height: 26,
    padding: 0,
  },
  switchBase: {
    padding: 1,
    '&$checked': {
      transform: 'translateX(30px)',
      color: theme.palette.common.white,
      '& + $track': {
        backgroundColor: '#37bc9b',
        opacity: 1,
        border: 'none',
        '&:before': {
          opacity: 1,
        },
        '&:after': {
          opacity: 0,
        },
      },
    },
    '&$focusVisible $thumb': {
      color: '#37bc9b',
      border: '6px solid #fff',
    },
  },
  thumb: {
    width: 24,
    height: 24,
  },
  track: {
    borderRadius: 26 / 2,
    border: `1px solid ${theme.palette.grey[400]}`,
    backgroundColor: theme.palette.grey[50],
    opacity: 1,
    transition: theme.transitions.create(['background-color', 'border']),

    '&:before, &:after': {
      display: 'inline-block',
      position: 'absolute',
      top: '50%',
      width: '50%',
      transform: 'translateY(-50%)',
      color: '#fff',
      textAlign: 'center',
    },
    '&:before': {
      content: '"Ja"',
      left: 4,
      opacity: 0,
    },
    '&:after': {
      content: '"Nej"',
      right: 4,
      color: theme.palette.text.primary,
    },
  },
  checked: {},
  focusVisible: {},
  label: {
    fontSize: theme.typography.fontSize,
    marginLeft: theme.spacing(1),
  },
  labelRoot: {
    marginRight: 0,
    marginBottom: theme.spacing(1),
  },
}))

const ShowValidationErrorsSwitch = () => {
  const classes = useStyles()
  const showErrors = useSelector(getShowValidationErrors)
  const dispatch = useDispatch()
  const [toggled, setToggled] = useState(showErrors)

  const handleToggle = () => {
    dispatch(toggled ? hideValidationErrors() : showValidationErrors())
    setToggled(!toggled)
  }

  return (
    <FormControlLabel
      classes={{ label: classes.label, root: classes.labelRoot }}
      label="Visa vad som saknas"
      control={
        <Switch
          checked={toggled}
          classes={{
            root: classes.root,
            switchBase: classes.switchBase,
            thumb: classes.thumb,
            track: classes.track,
            checked: classes.checked,
          }}
          onChange={handleToggle}
          inputProps={{ 'aria-label': 'secondary checkbox' }}
        />
      }></FormControlLabel>
  )
}

export default ShowValidationErrorsSwitch
