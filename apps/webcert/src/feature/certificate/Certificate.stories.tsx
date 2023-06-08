import {
  CertificateData,
  CertificateMetadata,
  fakeCategoryElement,
  fakeCertificateMetaData,
  fakeCheckboxBooleanElement,
  fakeCheckboxMultipleDate,
  fakeDiagnosesElement,
  fakeICFDataElement,
  fakeRadioBooleanElement,
  fakeRadioMultipleCodeElement,
  fakeResourceLink,
  fakeTextAreaElement,
  ResourceLink,
  ResourceLinkType,
} from '@frontend/common'
import { Story } from '@storybook/react'
import faker from 'faker'
import React from 'react'
import { Provider } from 'react-redux'
import { certificateMiddleware } from '../../store/certificate/certificateMiddleware'
import { getCertificate } from '../../store/certificate/certificateSelectors'
import Certificate from './Certificate'
import { getCertificateSuccess } from '../../store/certificate/certificateActions'
import { configureApplicationStore } from '../../store/configureApplicationStore'

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
  const store = configureApplicationStore([certificateMiddleware])

  if (links.length === 0) {
    links = [
      fakeResourceLink({ type: ResourceLinkType.EDIT_CERTIFICATE }),
      fakeResourceLink({ type: ResourceLinkType.PRINT_CERTIFICATE }),
      fakeResourceLink({ type: ResourceLinkType.COPY_CERTIFICATE }),
      fakeResourceLink({ type: ResourceLinkType.DISPLAY_PATIENT_ADDRESS_IN_CERTIFICATE }),
    ]
  }

  if (metadata == null) {
    metadata = fakeCertificateMetaData()
  }

  store.dispatch(getCertificateSuccess({ certificate: { metadata, data, links } }))

  return <Provider store={store}>{getCertificate(store.getState()) && <Certificate />}</Provider>
}

export const Default = Template.bind({})
Default.args = {
  data: {
    ...fakeCategoryElement({ id: 'kategori 1' }),
    ...fakeCheckboxBooleanElement({ parent: 'kategori 1' }),
    ...fakeRadioMultipleCodeElement({ parent: 'kategori 1' }),

    ...fakeCategoryElement({ id: 'kategori 2' }),
    ...fakeRadioBooleanElement({ parent: 'kategori 2' }),
    ...fakeICFDataElement({ parent: 'kategori 2' }),

    ...fakeCategoryElement({ id: 'kategori 3' }),
    ...fakeCheckboxMultipleDate({ parent: 'kategori 3' }),

    ...fakeCategoryElement({ id: 'diagnoses' }),
    ...fakeDiagnosesElement({ parent: 'diagnoses' }),
    ...fakeTextAreaElement({ parent: 'diagnoses' }),

    ...fakeCategoryElement({ id: 'Funktionshinder' }),
    ...fakeTextAreaElement({
      parent: 'Funktionshinder',
      config: {
        accordion: {
          openText: 'Visa fritextfält',
          closeText: 'Dölj fritextfält',
          header: faker.lorem.sentence(5),
        },
      },
    }),
    ...fakeTextAreaElement({
      parent: 'Funktionshinder',
      config: {
        accordion: {
          openText: 'Visa fritextfält',
          closeText: 'Dölj fritextfält',
          header: faker.lorem.sentence(5),
        },
      },
    }),
    ...fakeTextAreaElement({
      parent: 'Funktionshinder',
      config: {
        accordion: {
          openText: 'Visa fritextfält',
          closeText: 'Dölj fritextfält',
          header: faker.lorem.sentence(5),
        },
      },
    }),
    ...fakeTextAreaElement({
      parent: 'Funktionshinder',
      config: {
        accordion: {
          openText: 'Visa fritextfält',
          closeText: 'Dölj fritextfält',
          header: faker.lorem.sentence(5),
        },
      },
    }),
  },
}

export const LISJP = Template.bind({})
LISJP.storyName = 'Läkarintyg för sjukpenning'
LISJP.args = {
  metadata: fakeCertificateMetaData({
    type: 'lisjp',
    typeVersion: '1.3',
    typeName: 'FK 7804',
  }),
  data: {},
}

export const DB = Template.bind({})
DB.storyName = 'Dödsbevis'
DB.args = {
  metadata: fakeCertificateMetaData({
    type: 'db',
    typeVersion: '1.0',
    typeName: 'Dödsbevis',
  }),
  data: {},
}
