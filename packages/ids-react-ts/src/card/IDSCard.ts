import { IDSCard as IDSCardElement } from '@inera/ids-core/components/card/card-element'
import '@inera/ids-core/components/card/register'
import { createComponent } from '@lit-labs/react'
import React from 'react'

export const IDSCard = createComponent({
  tagName: 'ids-card',
  elementClass: IDSCardElement,
  react: React,
})
