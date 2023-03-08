import { IDSTabPanel as IDSTabPanelElement } from '@inera/ids-core/components/tabs/panel/tab-panel-element'
import '@inera/ids-core/components/tabs/register'
import { createComponent } from '@lit-labs/react'
import React from 'react'

export const IDSTabPanel = createComponent({
  tagName: 'ids-tab-panel',
  elementClass: IDSTabPanelElement,
  react: React,
})
