import type { HTMLProps, MouseEventHandler } from 'react'
import { forwardRef } from 'react'
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
  color?: 'inherit' | 'default' | 'primary' | 'secondary'
  onSubmit?: (event: React.FormEvent) => void
  startIcon?: React.ReactNode
  text?: string
  tooltip?: string
  rounded?: boolean
  type?: 'button' | 'submit' | 'reset'
  number?: string | number
  buttonClasses?: string
  'data-testid'?: string
  inline?: boolean
}

const Button = styled.button<Props>`
  height: ${(props) => props.inline && '3rem'};
  white-space: nowrap;
`
export const CustomButton = forwardRef<HTMLButtonElement, HTMLProps<HTMLButtonElement> & Props>((props, ref) => {
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
    props.onClick && props.onClick(e)
  }

  return (
    <Wrapper
      filter={getIconFilter()}
      data-tooltip-id="tooltip"
      data-tooltip-content={props.tooltip}
      className={`custom-button ${props.className}`}
    >
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
