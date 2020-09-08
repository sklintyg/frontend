import React from 'react';
import { Certificate, isSigned } from '../..';

export interface CertificateHeaderProps {
  certificate: Certificate;
}

const CertificateHeader: React.FC<CertificateHeaderProps> = ({ certificate }) => {
  return (
    <div>
      <h1>{certificate.id}</h1>
      <h5>{isSigned(certificate.status) && 'Signerad!'}</h5>
    </div>
  );
};

export default CertificateHeader;
