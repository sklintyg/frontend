import "@inera/ids-design/components/data-table/data-table.css";
import { CertificateDto } from "@src/api/dataFormat";
import { useMemo, useState } from "react";

type SortDirection = "asc" | "desc";
type SortKey = "patient" | "certificateId" | "certificateType" | "createdBy" | "dateSigned";
type EmptyState = "idle" | "noCertificates";

type ColumnDefinition = {
    key: SortKey;
    label: string;
    getValue: (certificate: CertificateDto) => string;
    getSortValue: (certificate: CertificateDto) => string | number;
};

const columns: ColumnDefinition[] = [
    {
        key: "patient",
        label: "Patient",
        getValue: (certificate) => `${certificate.patientName} - ${certificate.personNumber}`,
        getSortValue: (certificate) => `${certificate.patientName} ${certificate.personNumber}`,
    },
    {
        key: "certificateId",
        label: "Intygs-ID",
        getValue: (certificate) => certificate.certificateId,
        getSortValue: (certificate) => certificate.certificateId,
    },
    {
        key: "certificateType",
        label: "Intygstyp",
        getValue: (certificate) => `${certificate.certificateType} v${certificate.certificateTypeVersion}`,
        getSortValue: (certificate) => `${certificate.certificateType} ${certificate.certificateTypeVersion}`,
    },
    {
        key: "createdBy",
        label: "Skapad av",
        getValue: (certificate) => certificate.createdBy,
        getSortValue: (certificate) => certificate.createdBy,
    },
    {
        key: "dateSigned",
        label: "Signerades",
        getValue: (certificate) => certificate.dateSigned,
        getSortValue: (certificate) => Date.parse(certificate.dateSigned) || certificate.dateSigned,
    },
];

function HeaderSortIcon({ direction }: { direction?: SortDirection }) {
    return (
        <span aria-hidden="true" className="ml-2 inline-flex w-4 shrink-0 flex-col items-center justify-center leading-none">
            <span
                className={`ids-data-table__icon ids-icon-arrow-up-small text-[0.625rem] ${direction === "asc" ? "opacity-100" : "opacity-30"}`}
            />
            <span
                className={`ids-data-table__icon -mt-0.5 ids-icon-arrow-down-small text-[0.625rem] ${direction === "desc" ? "opacity-100" : "opacity-30"}`}
            />
        </span>
    );
}

function HeaderRow({
    sortKey,
    sortDirection,
    onSortChange,
    isInteractive,
}: {
    sortKey: SortKey;
    sortDirection: SortDirection;
    onSortChange: (key: SortKey) => void;
    isInteractive: boolean;
}) {
    return (
        <tr>
            {columns.map((column) => (
                <th
                    key={column.key}
                    aria-sort={sortKey === column.key ? (sortDirection === "asc" ? "ascending" : "descending") : "none"}
                    className="px-3 py-2 text-left font-semibold"
                >
                    <button
                        type="button"
                        className="flex w-full items-center justify-between gap-2 rounded-sm bg-transparent p-0 text-left font-inherit text-inherit focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ids-focus"
                        disabled={!isInteractive}
                        onClick={() => onSortChange(column.key)}
                    >
                        <span>{column.label}</span>
                        <HeaderSortIcon direction={sortKey === column.key ? sortDirection : undefined} />
                    </button>
                    <span className="sr-only">
                        {sortKey === column.key
                            ? sortDirection === "asc"
                                ? " sorterad stigande"
                                : " sorterad fallande"
                            : " aktivera för sortering"}
                    </span>
                </th>
            ))}
        </tr>
    );
}

function DataRow({ certificate, onSelect }: { certificate: CertificateDto; onSelect: (certificate: CertificateDto) => void }) {
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
            {columns.map((column) => (
                <td key={`${certificate.certificateId}-${column.key}`} className="px-3 py-2 text-left">
                    {column.getValue(certificate)}
                </td>
            ))}
    </tr>
  )
}

function EmptyRow({ emptyState }: { emptyState: EmptyState }) {
    const message =
        emptyState === "idle"
            ? "Sök och välj en vårdenhet för att visa skickade intyg."
            : "Vald vårdenhet har inga skickade intyg."

    return (
        <tr>
            <td className="px-3 py-6 text-center text-ids-surface-text-secondary" colSpan={5}>
                {message}
            </td>
        </tr>
    )
};

export function Table({
    certificates = [],
    hasSelectedCareUnit,
    onSelectedCertificateChange,
}: {
    certificates?: CertificateDto[];
    hasSelectedCareUnit: boolean;
    onSelectedCertificateChange: (certificate: CertificateDto) => void;
}) {
    const [sortKey, setSortKey] = useState<SortKey>("dateSigned")
    const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
    const hasCertificates = certificates.length > 0
    const emptyState: EmptyState = hasSelectedCareUnit ? "noCertificates" : "idle"

    const sortedCertificates = useMemo(() => {
        return [...certificates].sort((left, right) => {
            const leftValue = columns.find((column) => column.key === sortKey)?.getSortValue(left)
            const rightValue = columns.find((column) => column.key === sortKey)?.getSortValue(right)

            if (leftValue === undefined || rightValue === undefined) {
                return 0
            }

            const comparison =
                typeof leftValue === "number" && typeof rightValue === "number"
                    ? leftValue - rightValue
                    : String(leftValue).localeCompare(String(rightValue), "sv", {
                          numeric: true,
                          sensitivity: "base",
                      })

            return sortDirection === "asc" ? comparison : -comparison
        })
    }, [certificates, sortDirection, sortKey])

    const handleSortChange = (key: SortKey) => {
        if (key === sortKey) {
            setSortDirection((currentDirection) => (currentDirection === "asc" ? "desc" : "asc"))
            return
        }

        setSortKey(key)
        setSortDirection("asc")
    }

    const rows: JSX.Element[] = []

    if (!hasCertificates) {
        rows.push(
            <EmptyRow
                emptyState={emptyState}
                key = {0}
            />
        )
    }     
    else {
        sortedCertificates.forEach(c => {
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
            <table className={`ids-data-table w-full ${hasCertificates ? "ids-data-table--interactive" : ""}`}>
                <thead>
                    <HeaderRow
                        sortKey={sortKey}
                        sortDirection={sortDirection}
                        onSortChange={handleSortChange}
                        isInteractive={hasCertificates}
                    />
                </thead>
                <tbody>
                    { rows }
                </tbody>
            </table>
        </div>
    );
}
