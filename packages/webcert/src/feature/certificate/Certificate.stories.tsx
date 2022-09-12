import { faker } from '@faker-js/faker'
import {
  CertificateData,
  CertificateMetadata,
  fakeCategoryElement,
  fakeCertificateData,
  fakeCertificateMetaData,
  fakeCheckboxBooleanElement,
  fakeCheckboxMultipleCodeElement,
  fakeCheckboxMultipleDate,
  fakeDiagnosesElement,
  fakeICFDataElement,
  fakeRadioMultipleCodeElement,
  fakeResourceLink,
  ResourceLink,
  ResourceLinkType,
} from '@frontend/common'
import { Story } from '@storybook/react'
import React from 'react'
import { Provider } from 'react-redux'
import { updateCertificate } from '../../store/certificate/certificateActions'
import { getCertificate } from '../../store/certificate/certificateSelectors'
import store from '../../store/store'

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

export const FK7804 = Template.bind({})
FK7804.args = {
  metadata: fakeCertificateMetaData({
    type: 'lisjp',
    typeVersion: '1.3',
    typeName: 'FK 7804',
  }),
  data: fakeCertificateData([]),
}
