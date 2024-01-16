import { Story } from '@storybook/react'
import React from 'react'
import { Provider } from 'react-redux'
import store from '../../../../store/store'
import { Props, UeSickLeavePeriod } from './UeSickLeavePeriod'
import { ConfigTypes, CertificateDataValueType, CertificateDataValidationType } from '../../../../types'

export default {
  title: 'Webcert/UeSickLeavePeriod',
  component: UeSickLeavePeriod,
}

const Template: Story<Props> = ({ ...args }) => {
  return (
    <Provider store={store}>
      <UeSickLeavePeriod {...args} />
    </Provider>
  )
}

export const Default = Template.bind({})
Default.args = {
  question: {
    id: '32',
    parent: 'bedomning',
    index: 18,
    config: {
      type: ConfigTypes.UE_SICK_LEAVE_PERIOD,
      text: 'Min bedömning av patientens nedsättning av arbetsförmågan',
      description: 'Utgångspunkten är att patientens arbetsförmåga ska bedömas i förhållande till hens normala arbetstid.',
      list: [
        {
          id: 'EN_FJARDEDEL',
          label: '25 procent',
        },
        {
          id: 'HALFTEN',
          label: '50 procent',
        },
        {
          id: 'TRE_FJARDEDEL',
          label: '75 procent',
        },
        {
          id: 'HELT_NEDSATT',
          label: '100 procent',
        },
      ],
    },
    value: {
      type: CertificateDataValueType.DATE_RANGE_LIST,
      list: [],
    },
    validation: [
      {
        type: CertificateDataValidationType.MANDATORY_VALIDATION,
        questionId: '32',
        expression: '$EN_FJARDEDEL || $HALFTEN || $TRE_FJARDEDEL || $HELT_NEDSATT',
      },
    ],
    visible: true,
    readOnly: false,
    mandatory: true,
    validationErrors: [],
  },
}
