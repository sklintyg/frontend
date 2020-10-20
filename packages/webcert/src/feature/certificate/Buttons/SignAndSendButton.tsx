import { makeStyles, Button } from '@material-ui/core'
import React from 'react'
import { signCertificate } from '../../../store/certificate/certificateActions'
import BorderColorIcon from '@material-ui/icons/BorderColor'
import { useDispatch, useSelector } from 'react-redux'
import { getIsValidating } from '../../../store/certificate/certificateSelectors'
import { ButtonTooltip } from '@frontend/common'

const useStyles = makeStyles((theme) => ({
  signButton: {
    backgroundColor: '#4c7b67',
    borderColor: '#4c7b67',
    color: '#fff',
  },
  tooltip: {
    backgroundColor: theme.palette.primary.main,
  },
}))

interface Props {
  name: string
  description: string
  enabled: boolean
}

const SignAndSendButton: React.FC<Props> = ({ name, description, enabled }) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const isValidating = useSelector(getIsValidating)

  return (
    <ButtonTooltip description={description}>
      <Button
        className={classes.signButton}
        startIcon={<BorderColorIcon />}
        disabled={isValidating || !enabled}
        variant="contained"
        onClick={() => {
          dispatch(signCertificate())
        }}>
        {name}
      </Button>
    </ButtonTooltip>
  )
}

export default SignAndSendButton
