import '@inera/ids-core/components/form/error-message/register'
import '@inera/ids-core/components/form/time/register'
import { IDSTime as IDSTimeElement } from '@inera/ids-core/components/form/time/time-element'
import { createComponent } from '@lit-labs/react'
import React from 'react'

export const IDSTime = createComponent({
  displayName: 'IDSTime',
  tagName: 'ids-time',
  elementClass: IDSTimeElement,
  react: React,
})
