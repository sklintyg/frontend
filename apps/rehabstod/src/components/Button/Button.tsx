/* eslint-disable react/button-has-type */
import { IDSButton, IDSSpinner } from '@inera/ids-react'
import type { ButtonHTMLAttributes, ComponentProps, ForwardedRef } from 'react'
import { forwardRef } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & Omit<ComponentProps<typeof IDSButton>, 'ref' | 'onclick'>

export const Button = forwardRef((props: ButtonProps, ref: ForwardedRef<HTMLButtonElement>) => {
  const {
    children,
    loading,
    size,
    active,
    block,
    fab,
    icon,
    disabled,
    type,
    toggle,
    tertiary,
    secondary,
    sblock,
    mblock,
    slot,
    ...buttonProps
  } = props

  return (
    <IDSButton
      active={active}
      block={block}
      disabled={disabled}
      fab={fab}
      icon={icon}
      loading={loading}
      size={size ?? 'm'}
      tertiary={tertiary}
      toggle={toggle}
      secondary={secondary}
      sblock={sblock}
      mblock={mblock}
      slot={slot}
    >
      <button ref={ref} disabled={disabled} type={type ?? 'button'} {...buttonProps}>
        {loading ? <IDSSpinner light /> : children}
      </button>
    </IDSButton>
  )
})

Button.displayName = 'Button'
