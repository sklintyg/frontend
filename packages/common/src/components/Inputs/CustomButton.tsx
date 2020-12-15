import React from 'react'
import { ButtonTooltip } from '@frontend/common/src'

interface Props {
  style?: 'primary' | 'secondary' | 'success' | 'default'
  disabled?: boolean
  className?: string
  color?: 'inherit' | 'default' | 'primary' | 'secondary'
  variant?: 'text' | 'outlined' | 'contained' | undefined
  onClick?: () => void
  startIcon?: React.ReactNode
  text?: string
  tooltip?: string
  squared?: boolean
}

export const CustomButton: React.FC<Props> = (props) => {
  let addedClass
  if (!props.squared) {
    addedClass = 'ic-button--rounded '
  }
  switch (props.style) {
    case 'success':
      addedClass += 'ic-btn--success iu-bg-success'
      break
    case 'primary':
      addedClass += 'ic-button--primary'
      break
    case 'secondary':
    case 'default':
    default:
      addedClass += 'ic-button--secondary'
  }

  return (
    <ButtonTooltip description={props.tooltip ? props.tooltip : ''}>
      <button className={'ic-button ' + addedClass} type="button" disabled={props.disabled} onClick={props.onClick}>
        <span className="iu-mr-200" style={{ display: 'flex' }}>
          {props.startIcon}
        </span>{' '}
        {props.text}{' '}
      </button>
    </ButtonTooltip>
  )
}

export default CustomButton
