import { CertificateStatus } from '..';

export const isSigned = (status: CertificateStatus): boolean => {
  return status !== CertificateStatus.UNSIGNED;
};
