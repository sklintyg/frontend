import { IDSProgressbar as IDSProgressbarElement } from '@inera/ids-core/components/progressbar/progressbar-element'
import '@inera/ids-core/components/progressbar/register'
import { createComponent } from '@lit-labs/react'
import React from 'react'

export const IDSProgressbar = createComponent({
  displayName: 'IDSProgressbar',
  tagName: 'ids-progressbar',
  elementClass: IDSProgressbarElement,
  react: React,
})
