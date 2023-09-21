import { IDSCrumb as IDSCrumbElement } from '@inera/ids-core/components/breadcrumbs/crumb/crumb-element'
import '@inera/ids-core/components/breadcrumbs/register'
import { createComponent } from '@lit-labs/react'
import React from 'react'

export const IDSCrumb = createComponent({
  displayName: 'IDSCrumb',
  tagName: 'ids-crumb',
  elementClass: IDSCrumbElement,
  react: React,
})
