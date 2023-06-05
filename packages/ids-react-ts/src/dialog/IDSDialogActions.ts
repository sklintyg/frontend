import { IDSDialogActions as IDSDialogActionsElement } from '@inera/ids-core/components/dialog/actions/dialog-actions-element'
import '@inera/ids-core/components/dialog/register'
import { createComponent } from '@lit-labs/react'
import React from 'react'

export const IDSDialogActions = createComponent({
  displayName: 'IDSDialogActions',
  tagName: 'ids-dialog-actions',
  elementClass: IDSDialogActionsElement,
  react: React,
})
