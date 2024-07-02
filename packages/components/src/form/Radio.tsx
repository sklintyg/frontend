import { IDSRadio } from '@frontend/ids-react-ts'
import type { InputHTMLAttributes} from 'react';
import { forwardRef, useId } from 'react'

interface RadioProps {
  label: string
  light?: boolean
}

export const Radio = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & RadioProps>(({ label, light, ...props }, ref) => {
  const id = useId()
  return (
    <IDSRadio light={light} className="my-0">
      <input id={id} ref={ref} type="radio" {...props} />
      <label htmlFor={id}>{label}</label>
    </IDSRadio>
  )
})

Radio.displayName = 'Radio'
