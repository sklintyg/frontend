import { faker } from '@faker-js/faker'
import {
  CertificateData,
  CertificateMetadata,
  ConfigTypes,
  fakeCategoryElement,
  fakeCertificateData,
  fakeCertificateMetaData,
  fakeCheckboxBooleanElement,
  fakeCheckboxMultipleCodeElement,
  fakeCheckboxMultipleDate,
  fakeDataElement,
  fakeDiagnosesElement,
  fakeICFDataElement,
  fakeRadioMultipleCodeElement,
  fakeResourceLink,
  ResourceLink,
  ResourceLinkType,
} from '@frontend/common'
import { configureStore } from '@reduxjs/toolkit'
import { Story } from '@storybook/react'
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
    fakeCategoryElement({ id: 'kategori 2' }, [fakeCheckboxMultipleCodeElement(), fakeICFDataElement()]),
    fakeCategoryElement({ id: 'kategori 3' }, [fakeCheckboxMultipleDate()]),
    fakeCategoryElement({ id: 'diagnoses' }, [fakeDiagnosesElement()]),
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
      fakeRadioMultipleCodeElement({
        config: {
          text: 'Dödsdatum',
          list: [
            { id: '1', label: 'Säkert' },
            { id: '2', label: 'Ej säkert' },
          ],
        },
        mandatory: true,
      }),
      fakeDataElement({ config: { text: '', type: ConfigTypes.UE_UNCERTAIN_DATE } }),
      fakeDataElement({
        config: { text: 'Kommun (om okänd dödsplats, kommunen där kroppen påträffades)', type: ConfigTypes.UE_TYPEAHEAD },
        mandatory: true,
      }),
      fakeRadioMultipleCodeElement({
        config: {
          text: 'Boende där kroppen påträffades ',
          list: [
            { id: '1', label: 'Sjukhus' },
            { id: '2', label: 'Ordinärt boende' },
            { id: '3', label: 'Särskilt boende' },
            { id: '4', label: 'Annan/okänd' },
          ],
        },
        mandatory: true,
      }),
    ]),
    fakeCategoryElement({ config: { text: 'Barn som avlidit senast 28 dygn efter födelsen' } }, [
      fakeRadioMultipleCodeElement({
        config: {
          text: 'Avlidet inom 28 dygn efter födelsen',
          list: [
            { id: '1', label: 'Ja' },
            { id: '2', label: 'Nej' },
          ],
        },
        mandatory: true,
      }),
    ]),
    fakeCategoryElement({ config: { text: 'Explosivt implantat' } }, [
      fakeRadioMultipleCodeElement({
        config: {
          text: 'Har den avlidne haft ett implantat som kan explodera vid kremering?',
          list: [
            { id: '1', label: 'Ja' },
            { id: '2', label: 'Nej' },
          ],
        },
        mandatory: true,
      }),
    ]),
    fakeCategoryElement({ config: { text: 'Yttre undersökning' } }, [
      fakeRadioMultipleCodeElement({
        config: {
          text: 'Har yttre undersökning av kroppen genomförts?',
          list: [
            { id: '1', label: 'Ja' },
            { id: '2', label: 'Nej, rättsmedicinsk undersökning ska göras' },
            { id: '3', label: 'Nej, den avlidne undersökt kort före döden' },
          ],
        },
        mandatory: true,
      }),
    ]),
    fakeCategoryElement({ config: { text: 'Polisanmälan' } }, [
      fakeRadioMultipleCodeElement({
        config: {
          text: 'Finns skäl för polisanmälan?',
          list: [
            {
              id: 'ja',
              label:
                'Ja, om dödsfallet har eller kan ha orsakats av yttre påverkan (skada/förgiftning) eller fel/försummelse i vården eller den dödes identitet är okänd, ska polisanmälan göras och dödsbeviset lämnas till Polismyndigheten',
            },
            { id: 'nej', label: 'Nej' },
          ],
        },
        mandatory: true,
      }),
    ]),
  ]),
}
