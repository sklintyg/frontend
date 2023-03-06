import { IDSAlert as IDSAlertElement } from '@inera/ids-core/components/alert/alert-element'
import '@inera/ids-core/components/alert/register'
import { createComponent } from '@lit-labs/react'
import React from 'react'

export const IDSAlert = createComponent({
  tagName: 'ids-alert',
  elementClass: IDSAlertElement,
  react: React,
})
