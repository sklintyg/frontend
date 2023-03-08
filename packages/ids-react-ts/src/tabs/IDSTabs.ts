import '@inera/ids-core/components/tabs/register'
import { IDSTabs as IDSTabsElement } from '@inera/ids-core/components/tabs/tabs-element'
import { createComponent } from '@lit-labs/react'
import React from 'react'

export const IDSTabs = createComponent({
  tagName: 'ids-tabs',
  elementClass: IDSTabsElement,
  react: React,
})
