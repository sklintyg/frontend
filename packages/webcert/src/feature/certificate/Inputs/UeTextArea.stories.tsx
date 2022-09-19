import { CertificateDataValidationType, CertificateDataValueType, ConfigTypes } from '@frontend/common'
import { Story } from '@storybook/react'
import React from 'react'
import { Provider } from 'react-redux'
import store from '../../../store/store'
import UeTextArea, { Props } from './UeTextArea'

export default {
  title: 'Webcert/UeTextArea',
  component: UeTextArea,
}

const Template: Story<Props> = ({ ...args }) => {
  return (
    <Provider store={store}>
      <UeTextArea {...args} />
    </Provider>
  )
}

export const Default = Template.bind({})
Default.args = {
  question: {
    id: '19',
    parent: 'medicinskabehandlingar',
    index: 15,
    config: {
      type: ConfigTypes.UE_TEXTAREA,
      header: 'Pågående medicinska behandlingar/åtgärder.',
      text: 'Ange vad syftet är och om möjligt tidplan samt ansvarig vårdenhet.',
      description: '',
      id: 'pagaendeBehandling',
    },
    value: {
      type: CertificateDataValueType.TEXT,
      id: 'pagaendeBehandling',
      text: '',
    },
    validation: [
      {
        type: CertificateDataValidationType.HIDE_VALIDATION,
        questionId: '27',
        expression: '$avstangningSmittskydd',
      },
    ],
    visible: true,
    readOnly: false,
    mandatory: true,
    validationErrors: [],
  },
}
