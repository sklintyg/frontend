import React, { useEffect } from 'react'
import styled from 'styled-components'
import ReactTooltip, { Place } from 'react-tooltip'
import { getFilter } from '@frontend/webcert/src/components/icf/Styles'
import NumberCircle from '../utils/NumberCircle'

interface WrapperProps {
  filter: string
}

const Wrapper = styled.div<WrapperProps>`
  width: fit-content;

  .buttonIcon {
    width: 22px;
    height: 22px;
    margin-right: 10px !important;
    filter: ${(props) => props.filter};
  }
`

interface Props {
  buttonStyle?: 'primary' | 'secondary' | 'success' | 'default' | 'text'
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
  tooltipPlacement?: Place
  buttonClasses?: string
}

export const CustomButton: React.FC<Props & { ref?: React.Ref<HTMLButtonElement> }> = React.forwardRef((props, ref) => {
  useEffect(() => {
    ReactTooltip.rebuild()
  }, [props.tooltip])

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
        addedClass += 'ic-button--primary iu-border-main'
        break
      case 'default':
      case 'secondary':
      default:
        addedClass += 'ic-button--secondary'
        break
    }
  }

  const getIconFilter = (): string => {
    if (props.disabled) {
      return getFilter('grey')
    } else if (props.buttonStyle === 'success' || props.buttonStyle === 'primary') {
      return getFilter('white')
    }
    return getFilter('primary')
  }

  return (
    <Wrapper filter={getIconFilter()} data-tip={props.tooltip} className={`custom-button ${props.className}`}>
      <button
        aria-label={props.text}
        ref={ref as React.RefObject<HTMLButtonElement>}
        type={props.type ?? 'button'}
        onSubmit={props.onSubmit}
        className={'ic-button ' + addedClass + ' ' + props.buttonClasses}
        disabled={props.disabled}
        onClick={props.onClick}>
        {props.startIcon ? <span className="iu-mr-200 iu-flex buttonIcon">{props.startIcon}</span> : null}
        {props.children} {props.text}{' '}
        {props.number && <NumberCircle style={props.buttonStyle === 'secondary' ? 'secondary' : 'primary'} number={props.number} />}
      </button>
    </Wrapper>
  )
})

export default CustomButton
