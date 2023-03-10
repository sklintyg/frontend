import '@inera/ids-core/components/tabs/register'
import { IDSTab as IDSTabElement } from '@inera/ids-core/components/tabs/tab/tab-element'
import { createComponent } from '@lit-labs/react'
import React from 'react'

export const IDSTab = createComponent({
  displayName: 'IDSTab',
  tagName: 'ids-tab',
  elementClass: IDSTabElement,
  react: React,
})
