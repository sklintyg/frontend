import React from 'react'
import { makeStyles } from '@material-ui/core'
import colors from '../../../components/styles/colors'
import { ButtonTooltip } from '@frontend/common/src'

/**
const defaultHover = {
  backgroundColor: colors.WC_COLOR_21,
  shadow: '( 0, 0, 0, 0.24)',
  color: colors.WC_COLOR_00,
}

const defaultDisabled = {
  backgroundColor: colors.WC_COLOR_13,
  color: colors.WC_COLOR_22,
}

const useStyles = makeStyles((theme) => ({
  primary: {
    backgroundColor: colors.WC_COLOR_14,
    color: colors.WC_COLOR_00,
    borderRadius: '4px',
    '&:hover': defaultHover,
    '&:disabled': defaultDisabled,
  },
  secondary: {
    backgroundColor: colors.WC_COLOR_15,
    color: colors.WC_COLOR_08,
    borderRadius: '4px',
    '&:hover': defaultHover,
    '&:disabled': defaultDisabled,
  },
  success: {
    backgroundColor: colors.WC_COLOR_16,
    color: colors.WC_COLOR_00,
    borderRadius: '4px',
    '&:hover': defaultHover,
    '&:disabled': defaultDisabled,
  },
  default: {
    backgroundColor: colors.WC_COLOR_00,
    color: colors.WC_COLOR_17,
    borderColor: colors.WC_COLOR_17,
    borderRadius: '4px',
    '&:hover': {
      backgroundColor: colors.WC_COLOR_21,
      shadow: '( 0, 0, 0, 0.24)',
      color: colors.WC_COLOR_00,
      borderColor: 'inherit',
    },
    '&:disabled': defaultDisabled,
  },
}))
 **/

interface Props {
  style: 'primary' | 'secondary' | 'success' | 'default'
  disabled?: boolean
  className?: string
  color?: 'inherit' | 'default' | 'primary' | 'secondary'
  variant?: 'text' | 'outlined' | 'contained' | undefined
  onClick?: () => void
  startIcon?: React.ReactNode
  text?: string
  tooltip?: string
}

const CustomButton: React.FC<Props> = (props) => {
  //const classes = useStyles()

  let addedClass
  switch (props.style) {
    case 'success':
    case 'primary':
      addedClass = 'ic-button--primary'
      break
    case 'secondary':
    case 'default':
    default:
      addedClass = 'ic-button--secondary'
  }

  return (
    <ButtonTooltip description={props.tooltip ? props.tooltip : ''}>
      <button className={'ic-button ic-button--rounded ' + addedClass} type="button" disabled={props.disabled} onClick={props.onClick}>
        <span className="iu-mr-200" style={{ display: 'flex' }}>
          {props.startIcon}
        </span>{' '}
        {props.text}{' '}
      </button>
    </ButtonTooltip>
  )
}

export default CustomButton
