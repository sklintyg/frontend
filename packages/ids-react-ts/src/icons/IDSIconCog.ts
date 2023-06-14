import { IDSIconCog as IDSIconCogElement } from '@inera/ids-core/components/icons/cog/icon-cog-element'
import '@inera/ids-core/components/icons/cog/register'
import { createComponent } from '@lit-labs/react'
import React from 'react'

export const IDSIconCog = createComponent({
  displayName: 'IDSIconCog',
  tagName: 'ids-icon-cog',
  elementClass: IDSIconCogElement,
  react: React,
})
