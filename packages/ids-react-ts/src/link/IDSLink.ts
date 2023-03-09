import { IDSLink as IDSLinkElement } from '@inera/ids-core/components/link/link-element'
import '@inera/ids-core/components/link/register'
import { createComponent } from '@lit-labs/react'
import React from 'react'

export const IDSLink = createComponent({
  tagName: 'ids-link',
  elementClass: IDSLinkElement,
  react: React,
})
