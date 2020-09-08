import React from 'react';

import { Story } from '@storybook/react';
import CertificateHeader, { CertificateHeaderProps } from './CertificateHeader';
import { CertificateStatus } from '../..';

export default {
  title: 'Components/CertificateHeader',
  component: CertificateHeader,
};

const Template: Story<CertificateHeaderProps> = (args: CertificateHeaderProps) => (
  <CertificateHeader certificate={args.certificate} />
);

export const UnSignedCertificate = Template.bind({});
UnSignedCertificate.args = {
  certificate: {
    id: 'CertificateId1',
    status: CertificateStatus.UNSIGNED,
  },
};

export const SignedCertificate = Template.bind({});
SignedCertificate.args = {
  certificate: {
    id: 'CertificateId2',
    status: CertificateStatus.SIGNED,
  },
};
