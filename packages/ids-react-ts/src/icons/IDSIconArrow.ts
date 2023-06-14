import { IDSIconArrow as IDSIconArrowElement } from '@inera/ids-core/components/icons/arrow/icon-arrow-element'
import '@inera/ids-core/components/icons/arrow/register'
import { createComponent } from '@lit-labs/react'
import React from 'react'

export const IDSIconArrow = createComponent({
  displayName: 'IDSIconArrow',
  tagName: 'ids-icon-arrow',
  elementClass: IDSIconArrowElement,
  react: React,
})
