import { IDSIconChevronBold as IDSIconChevronBoldElement } from '@inera/ids-core/components/icons/chevron-bold/icon-chevron-bold-element'
import '@inera/ids-core/components/icons/chevron-bold/register'
import { createComponent } from '@lit-labs/react'
import React from 'react'

export const IDSIconChevronBold = createComponent({
  displayName: 'IDSIconChevronBold',
  tagName: 'ids-icon-chevron-bold',
  elementClass: IDSIconChevronBoldElement,
  react: React,
})
