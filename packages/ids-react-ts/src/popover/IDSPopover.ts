import { IDSPopover as IDSPopoverElement } from '@inera/ids-core/components/popover/popover-element'
import '@inera/ids-core/components/popover/register'
import { createComponent } from '@lit-labs/react'
import React from 'react'

export const IDSPopover = createComponent({
  tagName: 'ids-popover',
  elementClass: IDSPopoverElement,
  react: React,
})
