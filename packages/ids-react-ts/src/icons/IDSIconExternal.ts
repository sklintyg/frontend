import { IDSIconExternal as IDSIconExternalElement } from '@inera/ids-core/components/icons/external/icon-external-element'
import '@inera/ids-core/components/icons/external/register'
import { createComponent } from '@lit-labs/react'
import React from 'react'

export const IDSIconExternal = createComponent({
  displayName: 'IDSIconExternal',
  tagName: 'ids-icon-external',
  elementClass: IDSIconExternalElement,
  react: React,
})
