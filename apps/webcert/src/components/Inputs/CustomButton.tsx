import type { MouseEventHandler} from 'react';
import React, { useEffect } from 'react'
import type { Place } from 'react-tooltip';
import ReactTooltip from 'react-tooltip'
import styled from 'styled-components'
import { getFilter } from '../../utils/getFilters'
import { NumberCircle } from '../utils/NumberCircle'

interface WrapperProps {
  filter: string
}

const Wrapper = styled.div<WrapperProps>`
  width: fit-content;

  .buttonIcon {
    width: 22px;
    height: 22px;
    filter: ${(props) => props.filter};
  }
`

interface Props {
  buttonStyle?: 'primary' | 'secondary' | 'success' | 'default'
  disabled?: boolean
  className?: string
  color?: 'inherit' | 'default' | 'primary' | 'secondary'
  onClick?: MouseEventHandler<HTMLButtonElement>
  onSubmit?: (event: React.FormEvent) => void
  startIcon?: React.ReactNode
  text?: string
  tooltip?: string
  rounded?: boolean
  type?: 'button' | 'submit' | 'reset'
  number?: string | number
  tooltipPlacement?: Place
  buttonClasses?: string
  'data-testid'?: string
  inline?: boolean
}

const Button = styled.button<Props>`
  height: ${(props) => props.inline && '3rem'};
`

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

  const onClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    ReactTooltip.hide()
    props.onClick && props.onClick(e)
  }

  return (
    <Wrapper filter={getIconFilter()} data-tip={props.tooltip} className={`custom-button ${props.className}`}>
      <Button
        aria-label={props.text}
        ref={ref as React.RefObject<HTMLButtonElement>}
        type={props.type ?? 'button'}
        onSubmit={props.onSubmit}
        className={'ic-button ' + addedClass + ' ' + props.buttonClasses}
        disabled={props.disabled}
        onClick={onClick}
        data-testid={props['data-testid']}
        inline={props.inline}
      >
        {props.startIcon ? (
          <span className="iu-mr-200 iu-flex buttonIcon" style={{ fontSize: '1rem' }}>
            {props.startIcon}
          </span>
        ) : null}
        {props.children} {props.text}{' '}
        {props.number && <NumberCircle type={props.buttonStyle === 'secondary' ? 'secondary' : 'primary'} number={props.number} />}
      </Button>
    </Wrapper>
  )
})
