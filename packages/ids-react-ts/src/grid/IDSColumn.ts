import { IDSColumn as IDSColumnElement } from '@inera/ids-core/components/grid/column/column-element'
import '@inera/ids-core/components/grid/column/register'
import { createComponent } from '@lit-labs/react'
import React from 'react'

export const IDSColumn = createComponent({
  displayName: 'IDSColumn',
  tagName: 'ids-col',
  elementClass: IDSColumnElement,
  react: React,
})
