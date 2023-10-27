import { IDSIconAgent as IDSIconAgentElement } from '@inera/ids-core/components/icons/agent/icon-agent-element'
import '@inera/ids-core/components/icons/agent/register'
import { createComponent } from '@lit-labs/react'
import React from 'react'

export const IDSIconAgent = createComponent({
  displayName: 'IDSIconAgent',
  tagName: 'ids-icon-agent',
  elementClass: IDSIconAgentElement,
  react: React,
})
