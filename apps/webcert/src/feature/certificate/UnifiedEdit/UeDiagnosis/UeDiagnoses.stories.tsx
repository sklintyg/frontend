import { Story } from '@storybook/react'
import { Provider } from 'react-redux'
import { certificateMiddleware } from '../../../../store/certificate/certificateMiddleware'
import { configureApplicationStore } from '../../../../store/configureApplicationStore'
import { updateDiagnosisTypeahead } from '../../../../store/utils/utilsActions'
import { utilsMiddleware } from '../../../../store/utils/utilsMiddleware'
import UeDiagnoses, { Props } from './UeDiagnoses'
import React from 'react'
import { fakeCertificateConfig } from '../../../../faker'
import { ConfigTypes, CertificateDataValueType, CertificateDataValidationType } from '../../../../types'

export default {
  title: 'Webcert/UeDiagnoses',
  component: UeDiagnoses,
}

const Template: Story<Props> = ({ ...args }) => {
  const store = configureApplicationStore([utilsMiddleware, certificateMiddleware])
  store.dispatch(
    updateDiagnosisTypeahead({
      resultat: 'OK',
      diagnoser: [
        { kod: 'F50', beskrivning: 'Ätstörningar' },
        { kod: 'F500', beskrivning: 'Anorexia nervosa' },
        { kod: 'F501', beskrivning: 'Atypisk anorexia nervosa' },
        { kod: 'F502', beskrivning: 'Bulimia nervosa' },
        { kod: 'F503', beskrivning: 'Atypisk bulimia nervosa' },
        { kod: 'F504', beskrivning: 'Överdrivet ätande sammanhängande med andra psykiska störningar' },
        { kod: 'F505', beskrivning: 'Kräkningar sammanhängande med andra psykiska störningar' },
        { kod: 'F508', beskrivning: 'Andra specificerade ätstörningar' },
        { kod: 'F509', beskrivning: 'Ätstörning, ospecificerad' },
      ],
      moreResults: true,
    })
  )
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
