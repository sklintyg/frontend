import React from 'react'
import { ButtonTooltip } from '@frontend/common/src'

interface Props {
  style?: 'primary' | 'secondary' | 'success' | 'default'
  disabled?: boolean
  className?: string
  color?: 'inherit' | 'default' | 'primary' | 'secondary'
  onClick?: () => void
  startIcon?: React.ReactNode
  text?: string
  tooltip?: string
  rounded?: boolean
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
      <button className={'ic-button iu-radius-md ' + addedClass} type="button" disabled={props.disabled} onClick={props.onClick}>
        <span className="iu-mr-200" style={{ display: 'flex' }}>
          {props.startIcon}
        </span>{' '}
        {props.text}{' '}
      </button>
    </ButtonTooltip>
  )
}

export default CustomButton
