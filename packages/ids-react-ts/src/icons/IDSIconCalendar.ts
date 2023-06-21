import { IDSIconCalendar as IDSIconCalendarElement } from '@inera/ids-core/components/icons/calendar/icon-calendar-element'
import '@inera/ids-core/components/icons/calendar/register'
import { createComponent } from '@lit-labs/react'
import React from 'react'

export const IDSIconCalendar = createComponent({
  displayName: 'IDSIconCalendar',
  tagName: 'ids-icon-calendar',
  elementClass: IDSIconCalendarElement,
  react: React,
})
