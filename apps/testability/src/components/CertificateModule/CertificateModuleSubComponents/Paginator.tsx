import { IDSDataPagination } from "@inera/ids-react";

interface PaginatorProps {
    total: number
    page: number
    pageSize: number
    onPageChange: (page: number) => void
    onPageSizeChange: (pageSize: number) => void
}

export function Paginator({ total, page, pageSize, onPageChange, onPageSizeChange }: PaginatorProps) {
    const lastPage = Math.max(1, Math.ceil(total / pageSize))
    const from = total === 0 ? 0 : (page - 1) * pageSize + 1
    const to = Math.min(page * pageSize, total)

    return (
        <IDSDataPagination
            defaultValue={String(pageSize)}
            firstPageButton={<button type="button" aria-label="go to first page" onClick={() => onPageChange(1)} />}
            from={from}
            lastPageButton={<button type="button" aria-label="go to last page" onClick={() => onPageChange(lastPage)} />}
            nextButton={<button type="button" aria-label="go to next page" onClick={() => onPageChange(Math.min(page + 1, lastPage))} />}
            of="av"
            previousButton={<button type="button" aria-label="go to previous page" onClick={() => onPageChange(Math.max(page - 1, 1))} />}
            to={to}
            total={total}
        >
            <label htmlFor="my-select">
                Rader per sida
            </label>
            <select
                value={String(pageSize)}
                id="my-select"
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
            >
                <option
                    aria-label="10 sidor"
                    value="10"
                >
                    10
                </option>
                <option
                    aria-label="25 sidor"
                    value="25"
                >
                    25
                </option>
                <option
                    aria-label="50 sidor"
                    value="50"
                >
                    50
                </option>
                <option
                    aria-label="100 sidor"
                    value="100"
                >
                    100
                </option>
            </select>
        </IDSDataPagination>
    );
}