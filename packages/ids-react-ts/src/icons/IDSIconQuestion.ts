import { IDSIconQuestion as IDSIconQuestionElement } from '@inera/ids-core/components/icons/question/icon-question-element'
import '@inera/ids-core/components/icons/question/register'
import { createComponent } from '@lit-labs/react'
import React from 'react'

export const IDSIconQuestion = createComponent({
  displayName: 'IDSIconQuestion',
  tagName: 'ids-icon-question',
  elementClass: IDSIconQuestionElement,
  react: React,
})
