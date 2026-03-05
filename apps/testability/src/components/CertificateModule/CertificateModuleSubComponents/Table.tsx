

import { useState } from "react";

interface RowData {
    id: string;
    col1: string;
    col2: string;
    col3: string;
    col4: string;
    col5: string;
}

const makeDefaultRows = (count: number): RowData[] =>
    Array.from({ length: count }, (_, i) => ({
        id: crypto.randomUUID(),
        col1: `Row ${i + 1} A`,
        col2: `Row ${i + 1} B`,
        col3: `Row ${i + 1} C`,
        col4: `Row ${i + 1} D`,
        col5: `Row ${i + 1} E`,
    }));

function iconFor(key: keyof RowData, sortKey: keyof RowData | null, ascending: boolean) {
  if (sortKey !== key) return '';
  return ascending ? '▲' : '▼';
}

export function Table() {
    const [rows, setRows] = useState<RowData[]>(makeDefaultRows(10));
    const [sortKey, setSortKey] = useState<keyof RowData | null>(null);
    const [ascending, setAscending] = useState(true);

    const headers: { key: keyof RowData; label: string }[] = [
        { key: "col1", label: "Patient" },
        { key: "col2", label: "Intygs-ID" },
        { key: "col3", label: "Intygstyp" },
        { key: "col4", label: "Skapad av" },
        { key: "col5", label: "Signerades" },
    ];

    const sortBy = (key: keyof RowData) => {
        const asc = sortKey === key ? !ascending : true;
        const sorted = [...rows].sort((a, b) => {
            if (a[key] < b[key]) return asc ? -1 : 1;
            if (a[key] > b[key]) return asc ? 1 : -1;
            return 0;
        });
        setRows(sorted);
        setSortKey(key);
        setAscending(asc);
    };

    return (
        <div className="overflow-auto">
            <table className="w-full border-collapse">
                <thead>
                    <tr>
                        {headers.map(({ key, label }) => (
                            <th
                                key={key}
                                className="px-4 py-2 border cursor-pointer"
                                onClick={() => sortBy(key)}
                            >
                                {label} {iconFor(key, sortKey, ascending)}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row) => (
                        <tr key={row.id}>
                            <td className="px-4 py-2 border">{row.col1}</td>
                            <td className="px-4 py-2 border">{row.col2}</td>
                            <td className="px-4 py-2 border">{row.col3}</td>
                            <td className="px-4 py-2 border">{row.col4}</td>
                            <td className="px-4 py-2 border">{row.col5}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
