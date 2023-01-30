import { CertificateDataValidationType, CertificateDataValueType, ConfigTypes } from '@frontend/common'
import { Story } from '@storybook/react'
import React from 'react'
import { Provider } from 'react-redux'
import store from '../../../../store/store'
import UeDiagnoses, { Props } from './UeDiagnoses'
import { fakeCertificateConfig } from '@frontend/common/src/utils/faker/fakeCertificateConfig'

export default {
  title: 'Webcert/UeDiagnoses',
  component: UeDiagnoses,
}

const Template: Story<Props> = ({ ...args }) => {
  return (
    <Provider store={store}>
      <UeDiagnoses {...args} />
    </Provider>
  )
}

export const Default = Template.bind({})
Default.args = {
  question: {
    id: '6',
    parent: 'diagnos',
    index: 10,
    config: fakeCertificateConfig.diagnoses({
      type: ConfigTypes.UE_DIAGNOSES,
      text: 'Diagnos/diagnoser för sjukdom som orsakar nedsatt arbetsförmåga',
      description:
        'Ange vilken eller vilka sjukdomar som orsakar nedsatt arbetsförmåga. Den sjukdom som påverkar arbetsförmågan mest anges först. Diagnoskoden anges alltid med så många positioner som möjligt. Om patienten har fler än tre sjukdomar som påverkar arbetsförmågan anges dessa under "övriga upplysningar". ',
      terminology: [
        {
          id: 'ICD_10_SE',
          label: 'ICD-10-SE',
        },
        {
          id: 'KSH_97_P',
          label: 'KSH97-P (Primärvård)',
        },
      ],
      list: [
        {
          id: '1',
        },
        {
          id: '2',
        },
        {
          id: '3',
        },
      ],
    }),
    value: {
      type: CertificateDataValueType.DIAGNOSIS_LIST,
      list: [],
    },
    validation: [
      {
        type: CertificateDataValidationType.MANDATORY_VALIDATION,
        questionId: '6',
        expression: '$1',
      },
      {
        type: CertificateDataValidationType.TEXT_VALIDATION,
        questionId: '0',
        expression: '$1',
        limit: 81,
      },
    ],
    visible: true,
    readOnly: false,
    mandatory: true,
    validationErrors: [],
  },
}
