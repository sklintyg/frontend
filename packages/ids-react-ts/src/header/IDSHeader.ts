import { IDSHeader as IDSHeaderElement } from '@inera/ids-core/components/header/header-element'
import '@inera/ids-core/components/header/register'
import { createComponent } from '@lit-labs/react'
import React from 'react'

export const IDSHeader = createComponent({
  tagName: 'ids-header',
  elementClass: IDSHeaderElement,
  react: React,
})
