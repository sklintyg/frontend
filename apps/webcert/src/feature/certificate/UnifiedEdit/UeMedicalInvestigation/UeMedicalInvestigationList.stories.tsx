import { Story } from '@storybook/react'
import React from 'react'
import { Provider } from 'react-redux'
import store from '../../../../store/store'
import UeMedicalInvestigationList, { Props } from './UeMedicalInvestigationList'
import { fakeMedicalInvestigationListElement } from '../../../../faker'

export default {
  title: 'Webcert/UeMedicalInvestigationList',
  component: UeMedicalInvestigationList,
}

const Template: Story<Props> = ({ ...args }) => {
  return (
    <Provider store={store}>
      <UeMedicalInvestigationList {...args} />
    </Provider>
  )
}

export const Default = Template.bind({})
Default.args = {
  question: fakeMedicalInvestigationListElement({ id: '1' })['1'],
}
