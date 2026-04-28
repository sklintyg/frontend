import { IDSColumn, IDSRow, IDSContainer, IDSCard } from "@inera/ids-react";



import {Infobox} from "./CertificateModuleSubComponents/Infobox";
import {Select} from "./CertificateModuleSubComponents/Select";
import {Table} from "./CertificateModuleSubComponents/Table";
import {Paginator} from "./CertificateModuleSubComponents/Paginator";
import {IntroCard} from "./CertificateModuleSubComponents/IntroCard";

import { CertificateDto } from "@src/api/dataFormat";

import { useState, useEffect } from "react";
import { getCertificates } from "@src/api/testabilityServiceApi";


export function CertificateModule({
    onSelectedCertificateChange,
    onSelectedCareUnitChange,
}: {
    onSelectedCertificateChange: (certificate: CertificateDto) => void
    onSelectedCareUnitChange?: (hsaId: string) => void
}) {

    const [certificates, setCertificates] = useState<CertificateDto[]>([])
    const [hsaId, setHsaId] = useState<string | null>(null)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [total, setTotal] = useState(0)

    useEffect(() => {
        if (!hsaId) return

        const currentHsaId = hsaId
        const controller = new AbortController()

        async function load() {
            try {
                const result = await getCertificates(currentHsaId, page, pageSize, controller.signal)
                setCertificates(result.data)
                setTotal(result.total)
            } catch (err: unknown) {
                if (err instanceof Error && err.name !== 'AbortError') {
                    console.error('Failed to fetch certificates:', err)
                }
            }
        }

        load()

        return () => {
            controller.abort()
        }
    }, [hsaId, page, pageSize])

    const handleCertificatesChange = (id: string) => {
        setPage(1)
        setCertificates([])
        setTotal(0)
        setHsaId(id)
    };

    return (
        <IDSContainer gutterless className="gap-4">
            <IDSRow>
                <IDSColumn>
                    <h1 className="ids-heading-l">Välkommen till ärendesimulatorn</h1>
                </IDSColumn>
            </IDSRow>
            <IDSRow>
                <IDSColumn>
                    <IntroCard />
                </IDSColumn>
            </IDSRow>
            <IDSRow>
                <IDSColumn>
                    <Select onCertificatesChange={handleCertificatesChange} onSelectedCareUnitChange={onSelectedCareUnitChange} />
                </IDSColumn>
            </IDSRow>
            <IDSRow className="w-full min-w-0 overflow-hidden">
                <IDSColumn className="w-full min-w-0 overflow-hidden">
                    <Table
                        certificates={certificates}
                        hasSelectedCareUnit={Boolean(hsaId)}
                        onSelectedCertificateChange={onSelectedCertificateChange}
                    />
                </IDSColumn>
            </IDSRow>
            <IDSRow>
                <IDSColumn>
                    <Paginator
                        total={total}
                        page={page}
                        pageSize={pageSize}
                        onPageChange={setPage}
                        onPageSizeChange={(size) => { setPageSize(size); setPage(1) }}
                    />
                </IDSColumn>
            </IDSRow>
        </IDSContainer>
    )
}