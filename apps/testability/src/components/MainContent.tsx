import { IDSColumn, IDSRow, IDSContainer } from "@inera/ids-react";
import {CertificateModule} from "./CertificateModule/CertificateModuleLayout";

export function MainContent() {
  return (
    <IDSContainer>
        <IDSRow>
            <IDSColumn>
                <CertificateModule />
            </IDSColumn>
        </IDSRow>
    </IDSContainer>
  );
}