import { IDSDataPagination } from "@inera/ids-react";

export function Paginator() {
    return (
        <IDSDataPagination
            defaultValue="10"
            firstPageButton={<button type="button" aria-label="go to first page" onClick={() => { }} />}
            from={1}
            lastPageButton={<button type="button" aria-label="go to last page" onClick={() => { }} />}
            nextButton={<button type="button" aria-label="go to next page" onClick={() => { }} />}
            of="av"
            previousButton={<button type="button" aria-label="go to previous page" onClick={() => { }} />}
            to={10}
            total={306}
        >
            <label htmlFor="my-select">
                Rader per sida
            </label>
            <select
                defaultValue="10"
                id="my-select"
                onChange={() => { }}
            >
                <option
                    aria-label="10 sidor"
                    value="10"
                >
                    10
                </option>
                <option
                    aria-label="20 sidor"
                    value="20"
                >
                    20
                </option>
                <option
                    aria-label="30 sidor"
                    value="30"
                >
                    30
                </option>
                <option
                    aria-label="40 sidor"
                    value="40"
                >
                    40
                </option>
            </select>
        </IDSDataPagination>
    );
}