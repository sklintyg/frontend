import { IDSIconWarning as IDSIconWarningElement } from '@inera/ids-core/components/icons/warning/icon-warning-element'
import '@inera/ids-core/components/icons/attention/register'
import { createComponent } from '@lit-labs/react'
import React from 'react'

export const IDSIconWarning = createComponent({
  displayName: 'IDSIconWarning',
  tagName: 'ids-icon-warning',
  elementClass: IDSIconWarningElement,
  react: React,
})
