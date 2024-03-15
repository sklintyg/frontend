import { IDSIconSuccess as IDSIconSuccessElement } from '@inera/ids-core/components/icons/success/icon-success-element'
import '@inera/ids-core/components/icons/success/register'
import { createComponent } from '@lit-labs/react'
import React from 'react'

export const IDSIconSuccess = createComponent({
  displayName: 'IDSIconSuccess',
  tagName: 'ids-icon-success',
  elementClass: IDSIconSuccessElement,
  react: React,
})
