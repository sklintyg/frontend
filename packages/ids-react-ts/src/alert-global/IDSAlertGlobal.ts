import { IDSAlertGlobal as IDSAlertGlobalElement } from '@inera/ids-core/components/alert-global/alert-global-element'
import '@inera/ids-core/components/alert-global/register'
import { createComponent } from '@lit-labs/react'
import React from 'react'

export const IDSAlertGlobal = createComponent({
  displayName: 'IDSAlertGlobal',
  tagName: 'ids-alert-global',
  elementClass: IDSAlertGlobalElement,
  react: React,
})
