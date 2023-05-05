import { IDSErrorMessage as IDSErrorMessageElement } from '@inera/ids-core/components/form/error-message/error-message-element'
import '@inera/ids-core/components/form/error-message/register'
import { createComponent } from '@lit-labs/react'
import React from 'react'

export const IDSErrorMessage = createComponent({
  displayName: 'IDSErrorMessage',
  tagName: 'ids-error-message',
  elementClass: IDSErrorMessageElement,
  react: React,
})
