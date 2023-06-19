import { IDSIconAttention as IDSIconAttentionElement } from '@inera/ids-core/components/icons/attention/icon-attention-element'
import '@inera/ids-core/components/icons/attention/register'
import { createComponent } from '@lit-labs/react'
import React from 'react'

export const IDSIconAttention = createComponent({
  displayName: 'IDSIconAttention',
  tagName: 'ids-icon-attention',
  elementClass: IDSIconAttentionElement,
  react: React,
})
