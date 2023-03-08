import { IDSButtonGroup as IDSButtonGroupElement } from '@inera/ids-core/components/button-group/button-group-element'
import '@inera/ids-core/components/button-group/register'
import { createComponent } from '@lit-labs/react'
import React from 'react'

export const IDSButtonGroup = createComponent({
  tagName: 'ids-button-group',
  elementClass: IDSButtonGroupElement,
  react: React,
})
