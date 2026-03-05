import { IDSColumn, IDSRow, IDSContainer } from "@inera/ids-react";


import {Infobox} from "./CertificateModuleSubComponents/Infobox";
import {Select} from "./CertificateModuleSubComponents/Select";
import {Table} from "./CertificateModuleSubComponents/Table";
import {Paginator} from "./CertificateModuleSubComponents/Paginator";

export function CertificateModule () {

    return (
        <IDSContainer className="gap-4">
            <IDSRow>
                <IDSColumn>
                    <h1>Välkommen till ärendesimulatorn</h1>
                </IDSColumn>
            </IDSRow>
            <IDSRow>
                <IDSColumn>
                    <Infobox />
                </IDSColumn>
            </IDSRow>
            <IDSRow>
                <IDSColumn>
                    <Select />
                </IDSColumn>
            </IDSRow>
            <IDSRow>
                <IDSColumn>
                    <Table />
                </IDSColumn>
            </IDSRow>
            <IDSRow>
                <IDSColumn>
                    <Paginator />
                </IDSColumn>
            </IDSRow>
        </IDSContainer>
    )
}