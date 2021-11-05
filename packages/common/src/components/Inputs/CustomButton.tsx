import React from 'react'
import { ButtonTooltip } from '@frontend/common/src'
import styled from 'styled-components'

const NumberCircle = styled.span`
  width: 0px;
  height: 0px;
  padding: 3px 7px;
`

interface Props {
  buttonStyle?: 'primary' | 'secondary' | 'success' | 'default'
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
  tooltipClassName?: string
  buttonClasses?: string
}

export const CustomButton: React.FC<Props> = React.forwardRef((props, ref) => {
  let addedClass = ''
  if (props.rounded) {
    addedClass = 'ic-button--rounded '
  }
  if (props.disabled) {
    addedClass += 'ic-button--disabled'
  } else {
    switch (props.buttonStyle) {
      case 'success':
      case 'primary':
        addedClass += 'ic-button--primary'
        break
      case 'default':
      case 'secondary':
      default:
        addedClass += 'ic-button--secondary'
        break
    }
  }

  return (
    <ButtonTooltip description={props.tooltip ? props.tooltip : ''} className={props.tooltipClassName}>
      <button
        ref={ref as React.RefObject<HTMLButtonElement>}
        type={props.type ?? 'button'}
        onSubmit={props.onSubmit}
        className={'ic-button ' + addedClass + ' ' + props.buttonClasses}
        disabled={props.disabled}
        onClick={props.onClick}>
        {props.startIcon ? <span className="iu-mr-200 iu-flex">{props.startIcon}</span> : null}
        {props.children} {props.text}{' '}
        {props.number && (
          <NumberCircle
            className={`ic-notification iu-ml-300 iu-fs-100 
            ${props.buttonStyle === 'secondary' ? 'iu-bg-main iu-color-white' : 'iu-bg-white iu-color-main'}
            `}>
            {props.number}
          </NumberCircle>
        )}
      </button>
    </ButtonTooltip>
  )
})

export default CustomButton
