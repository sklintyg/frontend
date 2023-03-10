import { IDSFooter as IDSFooterElement } from '@inera/ids-core/components/footer/footer-element'
import '@inera/ids-core/components/footer/register'
import { createComponent } from '@lit-labs/react'
import React from 'react'

export const IDSFooter = createComponent({
  displayName: 'IDSFooter',
  tagName: 'ids-footer',
  elementClass: IDSFooterElement,
  react: React,
})
