import { IDSIconChevron as IDSIconChevronElement } from '@inera/ids-core/components/icons/chevron/icon-chevron-element'
import '@inera/ids-core/components/icons/chevron/register'
import { createComponent } from '@lit-labs/react'
import React from 'react'

export const IDSIconChevron = createComponent({
  displayName: 'IDSIconChevron',
  tagName: 'ids-icon-chevron',
  elementClass: IDSIconChevronElement,
  react: React,
})
