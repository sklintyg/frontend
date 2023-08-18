import '@inera/ids-core/components/icons/attention/register'
import { IDSIconMinus as IDSIconMinusElement } from '@inera/ids-core/components/icons/minus/icon-minus-element'
import { createComponent } from '@lit-labs/react'
import React from 'react'

export const IDSIconMinus = createComponent({
  displayName: 'IDSIconMinus',
  tagName: 'ids-icon-minus',
  elementClass: IDSIconMinusElement,
  react: React,
})
