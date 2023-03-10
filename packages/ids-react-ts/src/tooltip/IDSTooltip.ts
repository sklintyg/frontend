import '@inera/ids-core/components/tooltip/register'
import { IDSTooltip as IDSTooltipElement } from '@inera/ids-core/components/tooltip/tooltip-element'
import { createComponent } from '@lit-labs/react'
import React from 'react'

export const IDSTooltip = createComponent({
  displayName: 'IDSTooltip',
  tagName: 'ids-tooltip',
  elementClass: IDSTooltipElement,
  react: React,
})
