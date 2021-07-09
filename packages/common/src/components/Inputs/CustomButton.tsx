import React from 'react'
import { ButtonTooltip } from '@frontend/common/src'
import styled from 'styled-components'

const NumberCircle = styled.span`
  width: 0px;
  height: 0px;
  padding: 11px;
`
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
  number?: string | number | undefined
}

export const CustomButton: React.FC<Props> = (props) => {
  let addedClass = ''
  if (props.rounded) {
    addedClass = 'ic-button--rounded '
  }
  if (props.disabled) {
    addedClass += 'ic-button--disabled'
  } else {
    switch (props.style) {
      case 'success':
        addedClass += 'ic-button--primary iu-bg-grass-base iu-border-grass-base'
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
  }

  return (
    <ButtonTooltip description={props.tooltip ? props.tooltip : ''}>
      <button
        type={props.type ?? 'button'}
        onSubmit={props.onSubmit}
        className={'ic-button ' + addedClass}
        disabled={props.disabled}
        onClick={props.onClick}>
        {props.startIcon ? <span className="iu-mr-200 iu-flex">{props.startIcon}</span> : null}
        {props.children} {props.text}{' '}
        {props.number && <NumberCircle className={'ic-button--circle iu-ml-300 ic-button--secondary'}>{props.number}</NumberCircle>}
      </button>
    </ButtonTooltip>
  )
}

export default CustomButton
