import { IDSDialog as IDSDialogElement } from '@inera/ids-core/components/dialog/dialog-element'
import '@inera/ids-core/components/dialog/register'
import { createComponent } from '@lit-labs/react'
import React from 'react'

export const IDSDialog = createComponent({
  displayName: 'IDSDialog',
  tagName: 'ids-dialog',
  elementClass: IDSDialogElement,
  react: React,
})
