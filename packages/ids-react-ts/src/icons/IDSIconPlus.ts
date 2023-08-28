import '@inera/ids-core/components/icons/attention/register'
import { IDSIconPlus as IDSIconPlusElement } from '@inera/ids-core/components/icons/plus/icon-plus-element'
import { createComponent } from '@lit-labs/react'
import React from 'react'

export const IDSIconPlus = createComponent({
  displayName: 'IDSIconPlus',
  tagName: 'ids-icon-plus',
  elementClass: IDSIconPlusElement,
  react: React,
})
