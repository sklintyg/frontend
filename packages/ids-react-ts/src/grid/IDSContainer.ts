import { IDSContainer as IDSContainerElement } from '@inera/ids-core/components/grid/container/container-element'
import '@inera/ids-core/components/grid/container/register'
import { createComponent } from '@lit-labs/react'
import React from 'react'

export const IDSContainer = createComponent({
  displayName: 'IDSContainer',
  tagName: 'ids-container',
  elementClass: IDSContainerElement,
  react: React,
})
