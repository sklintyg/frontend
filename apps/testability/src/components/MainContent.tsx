import { IDSColumn, IDSRow, IDSContainer } from "@inera/ids-react";
import {CertificateModule} from "./CertificateModule/CertificateModule";
import { MessageModule } from "./MessageModule/MessageModule";
import { CertificateDto } from "@src/api/dataFormat";
import { useState } from "react";

export function MainContent() {

  const [SelectedCertificate, setSelectedCertificate] = useState<CertificateDto>();
  const [selectedCareUnitHsaId, setSelectedCareUnitHsaId] = useState<string>('')
  const [messageModuleKey, setMessageModuleKey] = useState(0)

  const handleResetMessageModule = () => {
    setSelectedCertificate(undefined)
    setSelectedCareUnitHsaId('')
    setMessageModuleKey((currentKey) => currentKey + 1)
  }
  
  return (
    <IDSContainer>
      <IDSRow className="my-8">
        <IDSColumn>
          <CertificateModule onSelectedCertificateChange={setSelectedCertificate} onSelectedCareUnitChange={setSelectedCareUnitHsaId} />
        </IDSColumn>
      </IDSRow>
      <hr className="ids-divider"></hr>
      <IDSRow className="my-8">
        <IDSColumn>
          <MessageModule
            key={messageModuleKey}
            SelectedCertificate={SelectedCertificate}
            selectedCareUnitHsaId={selectedCareUnitHsaId}
            onResetAll={handleResetMessageModule}
          />
        </IDSColumn>
      </IDSRow>
    </IDSContainer>
  )
}