import { CertificateDataValidationType, CertificateDataValueType, ConfigTypes } from '@frontend/common'
import { Story } from '@storybook/react'
import React from 'react'
import { Provider } from 'react-redux'
import store from '../../../store/store'
import UeCheckbox, { Props } from './UeCheckbox'

export default {
  title: 'Webcert/UeCheckbox',
  component: UeCheckbox,
}

const Template: Story<Props> = ({ ...args }) => {
  return (
    <Provider store={store}>
      <UeCheckbox {...args} />
    </Provider>
  )
}

export const Default = Template.bind({})
Default.args = {
  question: {
    id: '26',
    parent: 'kontakt',
    index: 32,
    config: {
      type: ConfigTypes.UE_CHECKBOX_BOOLEAN,
      label: 'Jag önskar att Försäkringskassan kontaktar mig.',
      text: 'Kontakt med Försäkringskassan',
      description: 'Försäkringskassans handläggare tar kontakt med dig när underlaget har kommit in och handläggningen kan påbörjas.',
      id: 'kontaktMedFk',
      selectedText: 'Ja',
      unselectedText: 'Nej',
    },
    value: {
      type: CertificateDataValueType.BOOLEAN,
      id: 'kontaktMedFk',
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
