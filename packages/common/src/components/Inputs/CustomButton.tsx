import React from 'react'
import { ButtonTooltip } from '@frontend/common/src'

interface Props {
  style?: 'primary' | 'secondary' | 'success' | 'default'
  disabled?: boolean
  className?: string
  color?: 'inherit' | 'default' | 'primary' | 'secondary'
  onClick?: () => void
  onSubmit?: (event: React.FormEvent) => void
  startIcon?: React.ReactNode
  text?: string
  tooltip?: string
  rounded?: boolean
  type?: 'button' | 'submit' | 'reset'
}

export const CustomButton: React.FC<Props> = (props) => {
  let addedClass = ''
  if (props.rounded) {
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
      addedClass += 'ic-button--secondary'
      break
    case 'default':
    default:
      addedClass += 'ic-button--default iu-bg-white iu-border-black iu-color-black'
      break
  }

  return (
    <ButtonTooltip description={props.tooltip ? props.tooltip : ''}>
      <button
        type={props.type ?? 'button'}
        onSubmit={props.onSubmit}
        className={'ic-button iu-radius-md ' + addedClass}
        disabled={props.disabled}
        onClick={props.onClick}>
        <span className="iu-mr-200 iu-flex">{props.startIcon}</span>
        {props.children} {props.text}{' '}
      </button>
    </ButtonTooltip>
  )
}

export default CustomButton
