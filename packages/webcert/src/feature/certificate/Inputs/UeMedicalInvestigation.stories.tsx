import { fakeMedicalInvestigationListElement } from '@frontend/common'
import { Story } from '@storybook/react'
import React from 'react'
import { Provider } from 'react-redux'
import store from '../../../store/store'
import UeMedicalInvestigation, { Props } from './UeMedicalInvestigation'

export default {
  title: 'Webcert/UeMedicalInvestigation',
  component: UeMedicalInvestigation,
}

const Template: Story<Props> = ({ ...args }) => {
  return (
    <Provider store={store}>
      <UeMedicalInvestigation {...args} />
    </Provider>
  )
}

export const Default = Template.bind({})
Default.args = {
  question: fakeMedicalInvestigationListElement({ id: '1' })['1'],
}
