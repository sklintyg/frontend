import '@inera/ids-core/components/form/spinner/register'
import { IDSSpinner as IDSSpinnerElement } from '@inera/ids-core/components/form/spinner/spinner-element'
import { createComponent } from '@lit-labs/react'
import React from 'react'

export const IDSSpinner = createComponent({
  displayName: 'IDSSpinner',
  tagName: 'ids-spinner',
  elementClass: IDSSpinnerElement,
  react: React,
})
