import { IDSIconInformation as IDSIconInformationElement } from '@inera/ids-core/components/icons/information/icon-information-element'
import '@inera/ids-core/components/icons/attention/register'
import { createComponent } from '@lit-labs/react'
import React from 'react'

export const IDSIconInformation = createComponent({
  displayName: 'IDSIconInformation',
  tagName: 'ids-icon-information',
  elementClass: IDSIconInformationElement,
  react: React,
})
