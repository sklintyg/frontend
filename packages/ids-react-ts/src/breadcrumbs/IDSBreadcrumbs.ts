import { IDSBreadcrumbs as IDSBreadcrumbsElement } from '@inera/ids-core/components/breadcrumbs/breadcrumbs-element'
import '@inera/ids-core/components/breadcrumbs/register'
import { createComponent } from '@lit-labs/react'
import React from 'react'

export const IDSBreadcrumbs = createComponent({
  displayName: 'IDSBreadcrumbs',
  tagName: 'ids-breadcrumbs',
  elementClass: IDSBreadcrumbsElement,
  react: React,
})
