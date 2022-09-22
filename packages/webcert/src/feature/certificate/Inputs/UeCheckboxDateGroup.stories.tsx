import { CertificateDataValidationType, CertificateDataValueType, ConfigTypes } from '@frontend/common'
import { Story } from '@storybook/react'
import React from 'react'
import { Provider } from 'react-redux'
import store from '../../../store/store'
import UeCheckboxDateGroup, { Props } from './UeCheckboxDateGroup'

export default {
  title: 'Webcert/UeCheckboxDateGroup',
  component: UeCheckboxDateGroup,
}

const Template: Story<Props> = ({ ...args }) => {
  return (
    <Provider store={store}>
      <UeCheckboxDateGroup {...args} />
    </Provider>
  )
}

export const Default = Template.bind({})
Default.args = {
  question: {
    id: '1',
    parent: 'grundformu',
    index: 3,
    config: {
      type: ConfigTypes.UE_CHECKBOX_MULTIPLE_DATE,
      text: 'Intyget är baserat på',
      description:
        'Enligt Socialstyrelsens föreskrifter (SOSFS 2005:29) om utfärdande av intyg inom hälso- och sjukvården med mera ska ett intyg som regel utfärdas efter en personlig undersökning av intygspersonen. Om ett intyg inte grundas på en personlig undersökning, ska skälet till detta anges i intyget.\n\nAtt intyget grundas på det som framkommit vid en personlig undersökning är också viktigt för att Försäkringskassan ska kunna bedöma om din patient har rätt till sjukpenning.\n\nOm intyget inte grundas på en personlig undersökning ska du förklara under "Övriga upplysningar" hur du ändå har kunnat bedöma din patients sjukdomstillstånd och arbetsförmåga.',
      list: [
        {
          id: 'undersokningAvPatienten',
          label: 'Min undersökning av patienten',
        },
        {
          id: 'telefonkontaktMedPatienten',
          label: 'Min telefonkontakt med patienten',
        },
        {
          id: 'journaluppgifter',
          label: 'Journaluppgifter från den',
        },
        {
          id: 'annatGrundForMU',
          label: 'Annat',
        },
      ],
    },
    value: {
      type: CertificateDataValueType.DATE_LIST,
      list: [],
    },
    validation: [
      {
        type: CertificateDataValidationType.MANDATORY_VALIDATION,
        questionId: '1',
        expression: '$undersokningAvPatienten || $telefonkontaktMedPatienten || $journaluppgifter || $annatGrundForMU',
      },
      {
        type: CertificateDataValidationType.MAX_DATE_VALIDATION,
        id: 'undersokningAvPatienten',
        numberOfDays: 0,
        questionId: '0',
        expression: '',
      },
      {
        type: CertificateDataValidationType.MAX_DATE_VALIDATION,
        id: 'telefonkontaktMedPatienten',
        numberOfDays: 0,
        questionId: '0',
        expression: '',
      },
      {
        type: CertificateDataValidationType.MAX_DATE_VALIDATION,
        id: 'journaluppgifter',
        numberOfDays: 0,
        questionId: '0',
        expression: '',
      },
      {
        type: CertificateDataValidationType.MAX_DATE_VALIDATION,
        id: 'annatGrundForMU',
        numberOfDays: 0,
        questionId: '0',
        expression: '',
      },
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
