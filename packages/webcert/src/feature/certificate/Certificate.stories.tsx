import {
  CertificateData,
  CertificateDataValidationType,
  CertificateDataValueType,
  CertificateMetadata,
  ConfigTypes,
  fakeCategoryElement,
  fakeCertificateData,
  fakeCertificateDataValidation,
  fakeCertificateMetaData,
  fakeCheckboxBooleanElement,
  fakeCheckboxMultipleDate,
  fakeDataElement,
  fakeDiagnosesElement,
  fakeICFDataElement,
  fakeListItem,
  fakeRadioBooleanElement,
  fakeRadioMultipleCodeElement,
  fakeResourceLink,
  fakeTextAreaElement,
  MessageLevel,
  ResourceLink,
  ResourceLinkType,
} from '@frontend/common'
import { configureStore } from '@reduxjs/toolkit'
import { Story } from '@storybook/react'
import faker from 'faker'
import React from 'react'
import { Provider } from 'react-redux'
import { updateCertificate } from '../../store/certificate/certificateActions'
import { certificateMiddleware } from '../../store/certificate/certificateMiddleware'
import { getCertificate } from '../../store/certificate/certificateSelectors'
import reducer from '../../store/reducers'
import Certificate from './Certificate'

export default {
  title: 'Webcert/Certificate',
  component: Certificate,
}

faker.seed(10)

interface Props {
  metadata: CertificateMetadata
  data: CertificateData
  links: ResourceLink[]
}

const Template: Story<Props> = ({ metadata = undefined, data, links = [] }) => {
  const store = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(certificateMiddleware),
  })

  if (links.length === 0) {
    links = [
      fakeResourceLink({ type: ResourceLinkType.EDIT_CERTIFICATE }),
      fakeResourceLink({ type: ResourceLinkType.PRINT_CERTIFICATE }),
      fakeResourceLink({ type: ResourceLinkType.COPY_CERTIFICATE }),
    ]
  }

  if (metadata == null) {
    metadata = fakeCertificateMetaData()
  }

  store.dispatch(updateCertificate({ metadata, data, links }))

  return <Provider store={store}>{getCertificate(store.getState()) && <Certificate />}</Provider>
}

export const Default = Template.bind({})
Default.args = {
  data: fakeCertificateData([
    fakeCategoryElement({ id: 'kategori 1' }, [fakeCheckboxBooleanElement(), fakeRadioMultipleCodeElement()]),
    fakeCategoryElement({ id: 'kategori 2' }, [fakeRadioBooleanElement(), fakeICFDataElement()]),
    fakeCategoryElement({ id: 'kategori 3' }, [fakeCheckboxMultipleDate()]),
    fakeCategoryElement({ id: 'diagnoses' }, [fakeDiagnosesElement(), fakeTextAreaElement()]),
  ]),
}

export const LISJP = Template.bind({})
LISJP.storyName = 'Läkarintyg för sjukpenning'
LISJP.args = {
  metadata: fakeCertificateMetaData({
    type: 'lisjp',
    typeVersion: '1.3',
    typeName: 'FK 7804',
  }),
  data: fakeCertificateData([]),
}

export const DB = Template.bind({})
DB.storyName = 'Dödsbevis'
DB.args = {
  metadata: fakeCertificateMetaData({
    type: 'db',
    typeVersion: '1.0',
    typeName: 'Dödsbevis',
  }),
  data: fakeCertificateData([
    fakeCategoryElement({ config: { text: 'Patientens adressuppgifter' } }, [
      fakeDataElement({ config: { text: 'Postadress', type: ConfigTypes.UE_TEXTFIELD } }),
      fakeDataElement({ config: { text: 'Postnummer', type: ConfigTypes.UE_TEXTFIELD } }),
      fakeDataElement({ config: { text: 'Postort', type: ConfigTypes.UE_TEXTFIELD } }),
    ]),
    fakeCategoryElement({ config: { text: 'Komplitterande patientuppgifter' } }, [
      fakeDataElement({ config: { text: 'Identiteten styrkt genom', type: ConfigTypes.UE_TEXTFIELD }, mandatory: true }),
    ]),
    fakeCategoryElement({ config: { text: 'Dödsdatum och dödsplats' } }, [
      fakeRadioBooleanElement({
        id: 'dodsdatum',
        config: {
          text: 'Dödsdatum',
          selectedText: 'Säkert',
          unselectedText: 'Ej säkert',
        },
        value: {
          id: 'DODSDATUM',
        },
        mandatory: true,
      }),
      fakeDataElement({
        config: { text: 'Datum', type: ConfigTypes.UE_DATE },
        validation: [
          fakeCertificateDataValidation({
            type: CertificateDataValidationType.SHOW_VALIDATION,
            questionId: 'dodsdatum',
            expression: '$DODSDATUM',
          }),
        ],
        mandatory: true,
      }),
      fakeDataElement({
        config: { text: '', type: ConfigTypes.UE_UNCERTAIN_DATE },
        validation: [
          fakeCertificateDataValidation({
            type: CertificateDataValidationType.HIDE_VALIDATION,
            questionId: 'dodsdatum',
            expression: '$DODSDATUM',
          }),
        ],
      }),
      fakeDataElement({
        config: { text: 'Anträffad död', type: ConfigTypes.UE_DATE },
        validation: [
          fakeCertificateDataValidation({
            type: CertificateDataValidationType.HIDE_VALIDATION,
            questionId: 'dodsdatum',
            expression: '$DODSDATUM',
          }),
        ],
        mandatory: true,
      }),
      fakeDataElement({
        config: { text: 'Kommun (om okänd dödsplats, kommunen där kroppen påträffades)', type: ConfigTypes.UE_TYPEAHEAD },
        mandatory: true,
      }),
      fakeRadioMultipleCodeElement({
        config: {
          text: 'Boende där kroppen påträffades ',
          list: [
            fakeListItem({ label: 'Sjukhus' }),
            fakeListItem({ label: 'Ordinärt boende' }),
            fakeListItem({ label: 'Särskilt boende' }),
            fakeListItem({ label: 'Annan/okänd' }),
          ],
        },
        mandatory: true,
      }),
    ]),
    fakeCategoryElement({ config: { text: 'Barn som avlidit senast 28 dygn efter födelsen' } }, [
      fakeRadioMultipleCodeElement({
        config: {
          text: 'Avlidet inom 28 dygn efter födelsen',
          list: [fakeListItem({ label: 'Ja' }), fakeListItem({ label: 'Nej' })],
        },
        mandatory: true,
      }),
    ]),
    fakeCategoryElement({ config: { text: 'Explosivt implantat' } }, [
      fakeRadioMultipleCodeElement({
        config: {
          text: 'Har den avlidne haft ett implantat som kan explodera vid kremering?',
          list: [fakeListItem({ label: 'Ja' }), fakeListItem({ label: 'Nej' })],
        },
        mandatory: true,
      }),
    ]),
    fakeCategoryElement({ config: { text: 'Yttre undersökning' } }, [
      fakeRadioMultipleCodeElement({
        id: 'yttreUndersokning',
        config: {
          text: 'Har yttre undersökning av kroppen genomförts?',
          list: [
            fakeListItem({ id: 'YTTRE_UNDERSOKNING_JA', label: 'Ja' }),
            fakeListItem({ id: 'YTTRE_UNDERSOKNING_NEJ_RATTS', label: 'Nej, rättsmedicinsk undersökning ska göras' }),
            fakeListItem({ id: 'YTTRE_UNDERSOKNING_NEJ', label: 'Nej, den avlidne undersökt kort före döden' }),
          ],
        },
        mandatory: true,
      }),
      fakeDataElement({
        config: { text: 'Undersökningsdatum', type: ConfigTypes.UE_DATE },
        validation: [
          fakeCertificateDataValidation({
            type: CertificateDataValidationType.SHOW_VALIDATION,
            questionId: 'yttreUndersokning',
            expression: '$YTTRE_UNDERSOKNING_NEJ',
          }),
        ],
        mandatory: true,
      }),
    ]),
    fakeCategoryElement({ config: { text: 'Polisanmälan' } }, [
      fakeRadioBooleanElement({
        config: {
          id: 'polisanmalan',
          text: 'Finns skäl för polisanmälan?',
          selectedText:
            'Ja, om dödsfallet har eller kan ha orsakats av yttre påverkan (skada/förgiftning) eller fel/försummelse i vården eller den dödes identitet är okänd, ska polisanmälan göras och dödsbeviset lämnas till Polismyndigheten',
          unselectedText: 'Nej',
        },
        validation: [
          fakeCertificateDataValidation({
            id: 'polisanmalan_auto_fill',
            type: CertificateDataValidationType.AUTO_FILL_VALIDATION,
            fillValue: {
              type: CertificateDataValueType.BOOLEAN,
              selected: true,
              id: 'polisanmalan',
            },
            questionId: 'yttreUndersokning',
            expression: '$YTTRE_UNDERSOKNING_NEJ_RATTS',
          }),
          fakeCertificateDataValidation({
            type: CertificateDataValidationType.DISABLE_VALIDATION,
            questionId: 'yttreUndersokning',
            expression: '$YTTRE_UNDERSOKNING_NEJ_RATTS',
          }),
        ],
        mandatory: true,
      }),
      fakeDataElement({
        config: {
          text: '',
          type: ConfigTypes.UE_MESSAGE,
          level: MessageLevel.INFO,
          message:
            'Du har angivit att en rättsmedicinsk undersökning ska göras. Detta kräver att en polisanmälan görs och fältet har därför förifyllts.',
        },
        validation: [
          fakeCertificateDataValidation({
            type: CertificateDataValidationType.SHOW_VALIDATION,
            questionId: 'yttreUndersokning',
            expression: '$YTTRE_UNDERSOKNING_NEJ_RATTS',
          }),
        ],
      }),
      fakeDataElement({
        config: {
          text: '',
          type: ConfigTypes.UE_MESSAGE,
          level: MessageLevel.OBSERVE,
          message: 'Skriv även ut dödsbeviset och skicka det till polisen per post/fax.',
        },
      }),
    ]),
  ]),
}
