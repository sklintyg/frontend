import "@inera/ids-design/components/data-table/data-table.css";
import { CertificateDto } from "@src/api/dataFormat";

function HeaderRow() {
    const headers = ["Patient", "Intygs-ID", "Intygstyp", "Skapad av", "Signerades"]
    return (
        <tr>
            {headers.map((h) => (
                <th key={h} className="px-3 py-2 text-left font-semibold">
                    {h}
                </th>
            ))}
        </tr>
    );
}

function DataRow({ certificate, onSelect }: { certificate: CertificateDto; onSelect: (certificate: CertificateDto) => void }) {
    const fields = [
        `${certificate.patientName} - ${certificate.personNumber}`,
        certificate.certificateId,
        `${certificate.certificateType} v${certificate.certificateTypeVersion}`,
        certificate.createdBy,
        certificate.dateSigned,
    ]

  return (
    <tr
            className="cursor-pointer"
            tabIndex={0}
            onClick={() => onSelect(certificate)}
            onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault()
                    onSelect(certificate)
                }
            }}
    >
            {fields.map((field, index) => (
                <td key={`${certificate.certificateId}-${index}`} className="px-3 py-2 text-left">
                    {field}
                </td>
            ))}
    </tr>
  )
}

function EmptyRow(){
    return (
        <tr>
            <td className="text-center" colSpan={5}> Vald vårdenhet har inga skickade intyg.</td>
        </tr>
    )
}

type TableProps = {
    certificates?: CertificateDto[];
};

export function Table({ certificates = [], onSelectedCertificateChange }: { certificates?: CertificateDto[]; onSelectedCertificateChange: (certificate: CertificateDto) => void }) {
    const rows: JSX.Element[] = []

    if (certificates.length === 0) {
        rows.push(
            <EmptyRow
                key = {0}
            />
        )
    }     
    else {
        certificates.forEach(c => {
            rows.push(
                <DataRow 
                    certificate={c}
                    onSelect={onSelectedCertificateChange}
                    key = {c.certificateId}
                />
            );
        })
    }

    return (
        <div className="border border-ids-surface-border overflow-x-auto overflow-y-hidden rounded-md">
            <table className="ids-data-table ids-data-table--interactive w-full">
                <thead>
                    { HeaderRow() }
                </thead>
                <tbody>
                    { rows }
                </tbody>
            </table>
        </div>
    );
}
