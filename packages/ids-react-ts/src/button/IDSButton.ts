import { IDSButton as IDSButtonElement } from '@inera/ids-core/components/button/button-element'
import '@inera/ids-core/components/button/register'
import { createComponent } from '@lit-labs/react'
import React from 'react'

export const IDSButton = createComponent({
  displayName: 'IDSButton',
  tagName: 'ids-button',
  elementClass: IDSButtonElement,
  react: React,
  events: {
    onclick: 'click',
  },
})
