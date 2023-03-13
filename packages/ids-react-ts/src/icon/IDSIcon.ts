import { IDSIcon as IDSIconElement } from '@inera/ids-core/components/icon/icon-element'
import '@inera/ids-core/components/icon/register'
import { createComponent } from '@lit-labs/react'
import React from 'react'

export const IDSIcon = createComponent({
  displayName: 'IDSIcon',
  tagName: 'ids-icon',
  elementClass: IDSIconElement,
  react: React,
})
