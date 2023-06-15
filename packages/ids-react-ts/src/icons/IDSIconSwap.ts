import { IDSIconSwap as IDSIconSwapElement } from '@inera/ids-core/components/icons/swap/icon-swap-element'
import '@inera/ids-core/components/icons/swap/register'
import { createComponent } from '@lit-labs/react'
import React from 'react'

export const IDSIconSwap = createComponent({
  displayName: 'IDSIconSwap',
  tagName: 'ids-icon-swap',
  elementClass: IDSIconSwapElement,
  react: React,
})
