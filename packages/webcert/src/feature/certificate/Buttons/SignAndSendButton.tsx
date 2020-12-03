import { makeStyles, Button } from '@material-ui/core'
import React from 'react'
import { signCertificate } from '../../../store/certificate/certificateActions'
import BorderColorIcon from '@material-ui/icons/BorderColor'
import { useDispatch, useSelector } from 'react-redux'
import { getIsValidating } from '../../../store/certificate/certificateSelectors'
import { ButtonTooltip } from '@frontend/common'
import colors from '../../../components/styles/colors'
import CustomButton from './CustomButton'

const useStyles = makeStyles((theme) => ({
  signButton: {
    backgroundColor: colors.IA_COLOR_17,
    borderColor: colors.IA_COLOR_17,
    color: '#fff',
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
    <CustomButton
      style="success"
      text={name}
      className={classes.signButton}
      startIcon={<BorderColorIcon />}
      disabled={isValidating || !enabled}
      variant="contained"
      onClick={() => {
        dispatch(signCertificate())
      }}></CustomButton>
  )
}

export default SignAndSendButton
